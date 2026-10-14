<?php
$servername = "localhost"; // servidor
$username = "root"; // usuario de mySQL
$password = ""; // contraseña
$dbname = "venecia", // nombre de la base datos

// crear conexion
$conn = new mysqli($servername, $username, $password, $dbname);

// verifica conexion
if ($conn->connect_error){
    die("conexion fallida" . $conn->connect_error);
}
?>
