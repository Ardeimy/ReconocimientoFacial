const video = document.getElementById("inputVideo");
const MODEL_URL = '/modelos';
var siCamara = 0

// Importando modelos entrenamos
await faceapi.loadSsdMobilenetv1Model(MODEL_URL) 
await faceapi.loadFaceLandmarkModel(MODEL_URL)
await faceapi.loadFaceRecognitionModel(MODEL_URL)
await faceapi.loadFaceExpressionModel(MODEL_URL)

document.getElementById("login").addEventListener("click", () => {
    if (siCamara == 0) {
        activarLogin();
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

function activarLogin() {
    const usuario = document.getElementById("usuario");
    const registro = document.getElementById("registro");
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
            if (xhr.responseText == "SI") {
                // Obtiene Foto
                const imagen1 = document.getElementById("miImagen1");
                const imagen2 = document.getElementById("miImagen2");
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
                        imagen1.src = xhr1.responseText;
                        const rostros = await faceapi.detectAllFaces(imagen1)
                        .withFaceLandmarks() 
                        .withFaceDescriptors();
                        console.log(rostros);
                        let siRostro = rostros.length;
                        if (siRostro == 1) {
                            // Compara Rostros
                            imagen2.src = "./imagenes/" + usuario + ".png";
                            const faceMatcher = new faceapi.FaceMatcher(rostros);
                            const unRostro = await faceapi.detectAllFaces(imagen2)
                                .withFaceLandmarks() 
                                .withFaceDescriptors();
                            console.log(unRostro);  
                            const bestMatch = faceMatcher.findBestMatch(unRostro[0].descriptor)
                            console.log(bestMatch._label)  
                            console.log(bestMatch._distance) 
                            var par = "par=" + xhr1.responseText;
                            var xhr2 = new XMLHttpRequest();
                            xhr2.open("POST", "borrar.php");
                            xhr2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                            xhr2.send(par);              
                            if (bestMatch._distance < 0.50) {
                                swal("Felicidades!!!",'Usuario Validado!',"success"); 
                                cancelarRostro(); 
                            } else {            
                                swal("Error Login de Usuario!!!",'Usuario Inválido!',"error");
                            }
                        } else if (siRostro != 1) {
                            var par = "par=" + xhr1.responseText;
                            var xhr2 = new XMLHttpRequest();
                            xhr2.open("POST", "borrar.php");
                            xhr2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                            xhr2.send(par);              
                            swal("Error Login de Usuario!!!",'Usuario Inválido!!',"error");
                        } else {
                            swal("Error de Reconocimiento Facial!!!",'Problemas Detectando Rostro!',"error");
                        } 
                    };
                }   
            } else {
                swal("Error Login de Usuario!!!",'Usuario Inválido!!',"error");
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
    const imagen1 = document.getElementById("miImagen1");
    const imagen2 = document.getElementById("miImagen2");
    imagen1.src = "";
    imagen2.src = "";  
    // Activa usuario
    siCamara = 0;
    const usuario = document.getElementById("usuario");
    usuario.disabled = false;
    usuario.value = "";
    usuario.focus();
}
