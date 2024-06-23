// Carpeta donde se ubian los modelos entreandos
const MODEL_URL = '/modelos';

// Importando modelos entrenamos
await faceapi.loadSsdMobilenetv1Model(MODEL_URL) 
await faceapi.loadFaceLandmarkModel(MODEL_URL)
await faceapi.loadFaceRecognitionModel(MODEL_URL)
await faceapi.loadFaceExpressionModel(MODEL_URL)

// Declarando constantes
const rostro = document.getElementById("rostro")
const image1 = document.getElementById('image1')
const image2 = document.getElementById('image2')

// Detectando rostros y vinculado a distintas funcionalidades
const results1 = await faceapi.detectAllFaces(image1)
    .withFaceLandmarks() 
    .withFaceDescriptors();

// Probando funcionalidades
const faceMatcher = new faceapi.FaceMatcher(results1)

// Detectando rostros y vinculado a distintas funcionalidades
const results2 = await faceapi.detectAllFaces(image2)
    .withFaceLandmarks() 
    .withFaceDescriptors();

 // Probando funcionalidades
const bestMatch = faceMatcher.findBestMatch(results2[0].descriptor)
console.log(bestMatch._label)  
console.log(bestMatch._distance)  

if (bestMatch._distance < 0.50) {
    rostro.innerHTML = "Es la misma persona!!!";
    rostro.style.color = "#17d821";
}
else {
    rostro.innerHTML = "No es la misma persona!!!";
}
