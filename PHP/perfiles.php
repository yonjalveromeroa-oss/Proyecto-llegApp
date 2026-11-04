<?php
require("conexion.php");

// El perfil es el del usuario que inició sesión
$correoSesion = mysqli_real_escape_string($conn, $_SESSION['correo'] ?? "");

// Ver el perfil
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $resultado = mysqli_query($conn, "SELECT * FROM perfiles WHERE email = '$correoSesion'");
    $perfil = mysqli_fetch_assoc($resultado);

    if (!$perfil) {
        $resultado = mysqli_query($conn, "SELECT nombre, correo AS email, colegio, '' AS partida, 'Activadas' AS notificaciones FROM usuarios WHERE correo = '$correoSesion'");
        $perfil = mysqli_fetch_assoc($resultado);
    }

    echo json_encode($perfil);
}

// Guardar el perfil
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = mysqli_real_escape_string($conn, $_POST['nombre']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $colegio = mysqli_real_escape_string($conn, $_POST['colegio']);
    $partida = mysqli_real_escape_string($conn, $_POST['partida']);
    $notificaciones = mysqli_real_escape_string($conn, $_POST['notificaciones']);

    // Si ya tiene perfil se actualiza, si no se crea
    $existe = mysqli_fetch_assoc(mysqli_query($conn, "SELECT id FROM perfiles WHERE email = '$correoSesion'"));
    if ($existe) {
        $sql = "UPDATE perfiles SET nombre = '$nombre', email = '$email', colegio = '$colegio',
                partida = '$partida', notificaciones = '$notificaciones' WHERE email = '$correoSesion'";
    } else {
        $sql = "INSERT INTO perfiles (nombre, email, colegio, partida, notificaciones)
                VALUES ('$nombre', '$email', '$colegio', '$partida', '$notificaciones')";
    }

    if (mysqli_query($conn, $sql)) {
        // También se cambian en la cuenta, para que pueda seguir entrando con el correo nuevo
        mysqli_query($conn, "UPDATE usuarios SET nombre = '$nombre', correo = '$email', colegio = '$colegio' WHERE correo = '$correoSesion'");
        $_SESSION['correo'] = $_POST['email'];
        echo json_encode(["ok" => true, "mensaje" => "Perfil registrado correctamente."]);
    } else {
        echo json_encode(["ok" => false, "mensaje" => "Error: " . mysqli_error($conn)]);
    }
}
?>
