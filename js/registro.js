const video = document.getElementById("inputVideo");
const MODEL_URL = '/modelos';
var siCamara = 0

// Importando modelos entrenamos
await faceapi.loadSsdMobilenetv1Model(MODEL_URL) 
await faceapi.loadFaceLandmarkModel(MODEL_URL)
await faceapi.loadFaceRecognitionModel(MODEL_URL)
await faceapi.loadFaceExpressionModel(MODEL_URL)

document.getElementById("registro").addEventListener("click", () => {
    if (siCamara == 0) {
        activarRegistro();
    } else {
		swal("Error del Sistema!!!",'El registro está en proceso!',"error");
	} 	
})

document.getElementById("aceptarRostro").addEventListener("click", () => {
	aceptarRostro();
})

document.getElementById("cancelarRostro").addEventListener("click", () => {
    cancelarRostro();
})

function activarRegistro() {
    const usuario = document.getElementById("usuario");
    const registro = document.getElementById("registro");
    if (usuario.value.length >= 5 ) {
        siCamara = 1;
        usuario.disabled = true;
        document.getElementById("contenedorDetalle").style.display = "block";
        navigator.mediaDevices.getUserMedia({ video: true, audio: false})
        .then(
            (stream) => {
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    video.play()
                }
            }
        )  
    } else {
        swal("Error de Entrada!!!",'La longitud mínima de caracteres cinco (5)...',"error");
    }
}

function aceptarRostro() {
    // Busca Usuario Como Archivo
    const usuario = document.getElementById("usuario").value;
    var archivo = "par=./imagenes/" + usuario + ".png";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "buscar.php");
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(archivo);
    xhr.onreadystatechange = function() {
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            if (xhr.responseText == "NO") {
                // Obtiene Foto
                const imagen = document.getElementById("miImagen");
                const canvas = document.getElementById("miCanvas");
                var contexto = canvas.getContext("2d");
                contexto.drawImage(video, 0, 0, 300, 225);
                var foto = canvas.toDataURL();
                // Guarda Foto
                var xhr1 = new XMLHttpRequest();
                xhr1.open("POST", "guardar.php", true);
                xhr1.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr1.send(encodeURIComponent(foto));
                xhr1.onreadystatechange = async function() {
                    if(xhr1.readyState == XMLHttpRequest.DONE && xhr1.status == 200) {
                        // Detecta Rostro
                        imagen.src = xhr1.responseText;
                        const rostros = await faceapi.detectAllFaces(imagen);
                        console.log(rostros);
                        let siRostro = rostros.length;
                        if (siRostro == 1) {
                            // Renombra Foto
                            var img1 = xhr1.responseText;
                            var img2 = "./imagenes/" + usuario + ".png";
                            var par = "par1=" + img1 + "&par2=" + img2;
                            var xhr2 = new XMLHttpRequest();
                            xhr2.open("POST", "renombrar.php");
                            xhr2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                            xhr2.send(par);
                            swal("Felicidades!!!",'Usuario Registrado!',"success"); 
                            cancelarRostro(); 
                        } else if (siRostro != 1) {
                            var par = "par=" + xhr1.responseText;
                            var xhr3 = new XMLHttpRequest();
                            xhr3.open("POST", "borrar.php");
                            xhr3.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                            xhr3.send(par);          
                            swal("Error Registro de Usuario!!!",'Rostro No Detectado!',"error");
                        } else {
                            swal("Error de Reconocimiento Facial!!!",'Problemas Detectando Rostro!',"error");
                        } 
                    };
                }   
            } else {
                swal("Error Registro de Usuario!!!",'Usuario o Rostro Existe!',"error");
            }            
        };
    }               
}

function cancelarRostro() {
	// Apaga la cámara y video
    let stream = video.srcObject;
	let tracks = stream.getTracks();
	tracks.forEach(function(track) {
	   track.stop();
	});	
	video.srcObject = null;   
    // Limpia Canvas y Foto
    let canvas = document.getElementById("miCanvas");
    let contexto = canvas.getContext("2d");
    contexto.clearRect(0, 0, 300, 225);	                     
    document.getElementById("contenedorDetalle").style.display = "none";
    //
    const imagen = document.getElementById("miImagen");
    imagen.src = "";
    // Activa usuario
    siCamara = 0;
    const usuario = document.getElementById("usuario");
    usuario.disabled = false;
    usuario.value = "";
    usuario.focus();
}
