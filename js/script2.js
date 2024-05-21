// Carpeta donde se ubian los modelos entreandos
const MODEL_URL = '/modelos';

// Importando modelos entrenamos
await faceapi.loadSsdMobilenetv1Model(MODEL_URL) 
await faceapi.loadFaceLandmarkModel(MODEL_URL)
await faceapi.loadFaceRecognitionModel(MODEL_URL)
await faceapi.loadFaceExpressionModel(MODEL_URL)

// Declarando constantes
const rostro = document.getElementById("rostro")
const image = document.getElementById('image')

// Detectando rostros y vinculado a distintas funcionalidades
const detections = await faceapi.detectAllFaces(image)
    .withFaceLandmarks() 
    .withFaceDescriptors() 
    .withFaceExpressions();

// Validando si es un rostro
const longitud = detections.length;
var continua = 0;

if (longitud == 1) {
    rostro.innerHTML = "Exito: Es un rostro!!!";
    rostro.style.color = "#17d821";
    continua = 1;
} else if (longitud == 0) {
    rostro.innerHTML = "Error: No es un rostro!!!";
} else if (longitud > 1) {
    rostro.innerHTML = "Error: Hay más de un rostro!!!";
} else {
    rostro.innerHTML = "Error: Problemas de detección!!!";
}

if (continua == 1) {
    // Trabajando el canvas
    const canvas = faceapi.createCanvasFromMedia(image)
    const displaySize = { width: image.width, height: image.height}
    document.body.append(canvas)
    faceapi.matchDimensions(canvas, displaySize)
    //Mostrando distintas funcionalidades
    faceapi.draw.drawDetections(canvas, detections)
    faceapi.draw.drawFaceLandmarks(canvas, detections)
    faceapi.draw.drawFaceExpressions(canvas, detections)
}
