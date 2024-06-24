<?php   
    $archivo = $_POST['par'];
    if (file_exists($archivo)) {
        exit("SI");
    } else {
        exit("NO");
    }
?>
