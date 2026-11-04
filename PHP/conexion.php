<?php
    if (session_status() === PHP_SESSION_NONE) session_start();

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "LlegApp";

mysqli_report(MYSQLI_REPORT_OFF);

$conn = new mysqli($servername, $username, $password, $dbname);
$conn->set_charset("utf8mb4");

if ($conn->connect_error){
    die("conexion fallida" . $conn->connect_error);
}
?>
