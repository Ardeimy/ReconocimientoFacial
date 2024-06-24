<?php 
    $imagen = file_get_contents("php://input"); 
    if(strlen($imagen) <= 0) exit("No se recibió ninguna imagen");
    $imagenMedia = str_replace("data:image/png;base64,", "", urldecode($imagen));
    $imagenFinal = base64_decode($imagenMedia);
    $nombreImagen = "./imagenes/foto_" . uniqid() . ".png";
    file_put_contents($nombreImagen, $imagenFinal);
    exit($nombreImagen);
?>
