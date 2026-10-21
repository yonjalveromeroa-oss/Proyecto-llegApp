<?php
require("conexion.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = $_POST['nombre'];
    $correo = $_POST['correo'];
    $colegio = $_POST['colegio'];
    $password = $_POST['password'];
    $estado = $_POST['estado'];

    $sql = "INSERT INTO usuarios (nombre, correo, colegio, password, estado)
            VALUES ('$nombre', '$correo', '$colegio', '$password', '$estado')";

    if (mysqli_query($conexion, $sql)) {
        echo "Usuario registrado correctamente.";
    } else {
        echo "Error: " . mysqli_error($conexion);
    }
}
?>
