<?php
session_start();
header("Content-Type: application/json; charset=utf-8");
require __DIR__ . "/conexion.php";
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT); // para que los try/catch funcionen

function responderRuta($datos, $codigo = 200) {
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

// Catálogo de rutas (público): rutas.php?accion=catalogo  o  rutas.php?accion=catalogo&numero=205
if ($_SERVER["REQUEST_METHOD"] === "GET" && ($_GET["accion"] ?? "") === "catalogo") {
    try {
        if (isset($_GET["numero"])) {
            $numero = trim($_GET["numero"]);
            $stmt = $conn->prepare("SELECT * FROM rutas WHERE numero = ? LIMIT 1");
            $stmt->bind_param("s", $numero);
            $stmt->execute();
            $ruta = $stmt->get_result()->fetch_assoc();
            if (!$ruta) responderRuta(["ok" => false, "mensaje" => "La ruta no existe."], 404);
            responderRuta(["ok" => true, "ruta" => $ruta]);
        }
        $result = $conn->query("SELECT * FROM rutas ORDER BY numero");
        responderRuta(["ok" => true, "rutas" => $result->fetch_all(MYSQLI_ASSOC)]);
    } catch (mysqli_sql_exception $e) {
        responderRuta(["ok" => false, "mensaje" => "No se pudieron consultar las rutas."], 500);
    }
}

if (empty($_SESSION["usuario_id"])) responderRuta(["ok" => false, "mensaje" => "Inicia sesión para guardar rutas."], 401);
$usuarioId = (int)$_SESSION["usuario_id"];
try {
    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $stmt = $conn->prepare("SELECT r.numero, r.descripcion, r.duracion, r.costo, r.paraderos, r.estado, r.link FROM rutas_guardadas g INNER JOIN rutas r ON r.numero = g.numero WHERE g.usuario_id = ? ORDER BY g.id DESC");
        $stmt->bind_param("i", $usuarioId);
        $stmt->execute();
        responderRuta(["ok" => true, "rutas" => $stmt->get_result()->fetch_all(MYSQLI_ASSOC)]);
    }

    $datos = $_POST;
    if ($_SERVER["REQUEST_METHOD"] === "DELETE") parse_str(file_get_contents("php://input"), $datos);
    $numero = trim($datos["numero"] ?? "");
    $validar = $conn->prepare("SELECT numero FROM rutas WHERE numero = ? LIMIT 1");
    $validar->bind_param("s", $numero);
    $validar->execute();
    if (!$validar->get_result()->fetch_assoc()) responderRuta(["ok" => false, "mensaje" => "Ruta no válida."], 422);

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $stmt = $conn->prepare("INSERT IGNORE INTO rutas_guardadas (usuario_id, numero) VALUES (?, ?)");
        $stmt->bind_param("is", $usuarioId, $numero);
        $stmt->execute();
        responderRuta(["ok" => true, "mensaje" => "Ruta guardada en tu cuenta."]);
    }
    if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
        $stmt = $conn->prepare("DELETE FROM rutas_guardadas WHERE usuario_id = ? AND numero = ?");
        $stmt->bind_param("is", $usuarioId, $numero);
        $stmt->execute();
        responderRuta(["ok" => true, "mensaje" => "Ruta eliminada de guardadas."]);
    }
    responderRuta(["ok" => false, "mensaje" => "Método no permitido."], 405);
} catch (mysqli_sql_exception $e) {
    responderRuta(["ok" => false, "mensaje" => "No se pudieron consultar las rutas."], 500);
}
?>
