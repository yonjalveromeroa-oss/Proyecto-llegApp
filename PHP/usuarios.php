<?php
require("conexion.php");

$accion = $_POST['accion'] ?? $_GET['accion'] ?? "";

// Crear cuenta
if ($_SERVER["REQUEST_METHOD"] == "POST" && $accion == "") {
    $nombre = mysqli_real_escape_string($conn, $_POST['nombre']);
    $correo = mysqli_real_escape_string($conn, $_POST['correo']);
    $colegio = mysqli_real_escape_string($conn, $_POST['colegio']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $estado = "Activo";

    $sql = "INSERT INTO usuarios (nombre, correo, colegio, password, estado)
            VALUES ('$nombre', '$correo', '$colegio', '$password', '$estado')";

    if (mysqli_query($conn, $sql)) {
        echo json_encode(["ok" => true, "mensaje" => "Usuario registrado correctamente."]);
    } else {
        echo json_encode(["ok" => false, "mensaje" => "Ese correo ya está registrado."]);
    }
}

// Iniciar sesión
if ($accion == "login") {
    $correo = mysqli_real_escape_string($conn, $_POST['correo']);

    $resultado = mysqli_query($conn, "SELECT * FROM usuarios WHERE correo = '$correo'");
    $usuario = mysqli_fetch_assoc($resultado);

    if ($usuario && password_verify($_POST['password'], $usuario['password'])) {
        $_SESSION['correo'] = $usuario['correo'];
        $_SESSION['usuario_id'] = (int) $usuario['id'];
        $_SESSION['rol'] = $usuario['rol'] ?? 'usuario';
        echo json_encode(["ok" => true, "rol" => $_SESSION['rol']]);
    } else {
        echo json_encode(["ok" => false, "mensaje" => "Correo o contraseña incorrectos."]);
    }
}

// Lista de usuarios (panel del administrador)
if ($accion == "listar") {
    $resultado = mysqli_query($conn, "SELECT id, nombre, correo, colegio, estado FROM usuarios");
    echo json_encode(mysqli_fetch_all($resultado, MYSQLI_ASSOC));
}

// Eliminar usuario (panel del administrador)
if ($accion == "eliminar") {
    $id = (int) $_POST['id'];
    mysqli_query($conn, "DELETE perfiles FROM perfiles JOIN usuarios ON usuarios.correo = perfiles.email WHERE usuarios.id = $id");
    mysqli_query($conn, "DELETE FROM usuarios WHERE id = $id");
    echo json_encode(["ok" => true]);
}

// Enviar una novedad (novedades.html)
if ($accion == "novedad") {
    $tipo = mysqli_real_escape_string($conn, $_POST['tipo']);
    $comentarios = mysqli_real_escape_string($conn, $_POST['comentarios']);
    mysqli_query($conn, "INSERT INTO novedades (tipo, comentarios) VALUES ('$tipo', '$comentarios')");
    echo json_encode(["ok" => true]);
}

// Lista de novedades (comentarioU.html y panel del administrador)
if ($accion == "novedades") {
    $resultado = mysqli_query($conn, "SELECT * FROM novedades ORDER BY fecha");
    echo json_encode(mysqli_fetch_all($resultado, MYSQLI_ASSOC));
}
?>
