<?php
require("conexion.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST['nombre'];
    $email = $_POST['email'];
    $colegio = $_POST['colegio'];
    $partida = $_POST['partida'];
    $notificaciones = $_POST['notificaciones'];

    $sql = "INSERT INTO perfiles (nombre, email, colegio, partida, notificaciones)
            VALUES ('$nombre', '$email', '$colegio', '$partida', '$notificaciones')";

    if (mysqli_query($conexion, $sql)) {
        echo "Perfil registrado correctamente.";
    } else {
        echo "Error: " . mysqli_error($conexion);
    }
}
?>