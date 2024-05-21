const video = document.getElementById("inputVideo");
var siCamara = 0

document.getElementById("activarCamara").addEventListener("click", () => {
    siCamara = 1;
	playCamara();
})

document.getElementById("detenerCamara").addEventListener("click", () => {
    if (siCamara == 1) {
		siCamara = 0;
		stopCamara();
	} else {
		swal("Error del Sistema!!!",'La cámara no esta encendida!',"error");
	} 	
})

document.getElementById("obtenerFoto").addEventListener("click", () => {
    if (siCamara == 1) {
		tomaFoto();
	} else {
		swal("Error del Sistema!!!",'La cámara no esta encendida!',"error");
	}	
})

function playCamara() {
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

function stopCamara() {
	let stream = video.srcObject;
	let tracks = stream.getTracks();
	tracks.forEach(function(track) {
	   track.stop();
	});	
	video.srcObject = null;   
    // Limpia Foto   
    let canvas = document.getElementById("miCanvas");
    let contexto = canvas.getContext("2d");
    contexto.clearRect(0, 0, 300, 225);	                     
}

function tomaFoto() {
    const canvas = document.getElementById("miCanvas");
    let contexto = canvas.getContext("2d");
    contexto.drawImage(video, 0, 0, 300, 225);
     /* Descargar Foto
     let foto = canvas.toDataURL();
     let enlace = document.createElement('a');
     enlace.download = "prueba.jpg";
     enlace.href = foto;
     enlace.click();    
     */ 
}
