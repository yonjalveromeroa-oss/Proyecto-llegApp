<?php
session_start();
header("Content-Type: application/json; charset=utf-8");
require __DIR__ . "/conexion.php";

function responderNovedad($datos, $codigo = 200) {
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $tipo = trim($_POST["tipo"] ?? "");
        $comentarios = trim($_POST["comentarios"] ?? "");
        if (!in_array($tipo, ["fuera-servicio", "retraso"], true) || $comentarios === "") {
            responderNovedad(["ok" => false, "mensaje" => "Selecciona un tipo y escribe un comentario."], 422);
        }
        $usuarioId = isset($_SESSION["usuario_id"]) ? (int)$_SESSION["usuario_id"] : null;
        $stmt = $conn->prepare("INSERT INTO novedades (usuario_id, tipo, comentarios) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $usuarioId, $tipo, $comentarios);
        $stmt->execute();
        responderNovedad(["ok" => true, "mensaje" => "Novedad enviada correctamente."]);
    }
    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        if (($_SESSION["rol"] ?? "") !== "admin") responderNovedad(["ok" => false, "mensaje" => "Se requiere una cuenta administradora."], 403);
        $result = $conn->query("SELECT id, tipo, comentarios, fecha FROM novedades ORDER BY fecha DESC, id DESC");
        responderNovedad(["ok" => true, "novedades" => $result->fetch_all(MYSQLI_ASSOC)]);
    }
    responderNovedad(["ok" => false, "mensaje" => "Método no permitido."], 405);
} catch (mysqli_sql_exception $e) {
    responderNovedad(["ok" => false, "mensaje" => "No se pudo procesar la novedad."], 500);
}
?>
