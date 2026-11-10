<?php
require("conexion.php");

$accion = $_POST['accion'] ?? $_GET['accion'] ?? "";

// Estas acciones solo las puede usar una cuenta administradora
if (in_array($accion, ["listar", "eliminar", "novedades"]) && ($_SESSION['rol'] ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(["ok" => false, "mensaje" => "Se requiere una cuenta administradora."]);
    exit;
}

// Quién inició sesión (para proteger páginas y mostrar el nombre)
if ($accion == "sesion") {
    $id = (int) ($_SESSION['usuario_id'] ?? 0);
    $usuario = $id ? mysqli_fetch_assoc(mysqli_query($conn, "SELECT nombre FROM usuarios WHERE id = $id")) : null;
    echo json_encode([
        "ok" => (bool) $usuario,
        "nombre" => $usuario['nombre'] ?? null,
        "rol" => $usuario ? ($_SESSION['rol'] ?? 'usuario') : null
    ]);
    exit;
}

// Cerrar sesión
if ($accion == "logout") {
    $_SESSION = [];
    session_destroy();
    echo json_encode(["ok" => true]);
    exit;
}

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
    if ($id === (int) ($_SESSION['usuario_id'] ?? 0)) {
        echo json_encode(["ok" => false, "mensaje" => "No puedes eliminar tu propia cuenta."]);
        exit;
    }
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
