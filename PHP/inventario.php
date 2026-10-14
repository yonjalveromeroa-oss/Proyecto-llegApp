<?php

require("conexion.php");


if ($_server["REQUEST_METHOD"] == "POST"){
    $categoria = $_POST['categoria'];
    $codigo_producto = $_POST['codigo_producto'];
    $nombre_producto = $_POST['nombre_producto'];
    $descripcion = $_POST['descripcion_producto'];
    $cantidad = $_POST['cantidad_producto'];
    $precio = $_POST['precio_unitario'];
    $proveedor = $_POST['proveedor_producto'];
}
?>