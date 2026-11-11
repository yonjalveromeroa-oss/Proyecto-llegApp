<?php
session_start();
header("Content-Type: application/json; charset=utf-8");
require __DIR__ . "/conexion.php";
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

function responderRuta($datos, $codigo = 200) {
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}


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
        responderRuta(["ok" => true, "rutas" => $stmt->get_result()->fetch_all(MYSQLI_ASSOC), "rol" => $_SESSION["rol"] ?? "usuario"]);
    }

   
    $accion = $_POST["accion"] ?? "";
    if ($_SERVER["REQUEST_METHOD"] === "POST" && in_array($accion, ["crear", "editar", "horario", "eliminar_ruta"], true)) {
        if (($_SESSION["rol"] ?? "") !== "admin") responderRuta(["ok" => false, "mensaje" => "Solo un administrador puede hacer esto."], 403);

        $numero = trim($_POST["numero"] ?? "");
        if ($numero === "" || mb_strlen($numero) > 10) responderRuta(["ok" => false, "mensaje" => "El número de ruta es obligatorio (máx. 10 caracteres)."], 422);

        $existe = $conn->prepare("SELECT numero FROM rutas WHERE numero = ? LIMIT 1");
        $existe->bind_param("s", $numero);
        $existe->execute();
        $rutaExiste = (bool)$existe->get_result()->fetch_assoc();
        if ($accion !== "crear" && !$rutaExiste) responderRuta(["ok" => false, "mensaje" => "La ruta no existe."], 404);
        if ($accion === "crear" && $rutaExiste) responderRuta(["ok" => false, "mensaje" => "Ya existe una ruta con el número $numero."], 409);

        if ($accion === "eliminar_ruta") {
            $stmt = $conn->prepare("DELETE FROM rutas WHERE numero = ?");
            $stmt->bind_param("s", $numero);
            $stmt->execute();
            responderRuta(["ok" => true, "mensaje" => "Ruta $numero eliminada."]);
        }

        $salidas = trim($_POST["salidas"] ?? "");
        $frecuencia = trim($_POST["frecuencia"] ?? "");
        $estado = trim($_POST["estado"] ?? "");
        if (!in_array($estado, ["En servicio", "Retraso", "Fuera de servicio"], true)) responderRuta(["ok" => false, "mensaje" => "Estado no válido."], 422);
        if (mb_strlen($salidas) > 100 || mb_strlen($frecuencia) > 30) responderRuta(["ok" => false, "mensaje" => "Las salidas (máx. 100) o la frecuencia (máx. 30) son muy largas."], 422);

        if ($accion === "horario") {
            $stmt = $conn->prepare("UPDATE rutas SET salidas = ?, frecuencia = ?, estado = ? WHERE numero = ?");
            $stmt->bind_param("ssss", $salidas, $frecuencia, $estado, $numero);
            $stmt->execute();
            responderRuta(["ok" => true, "mensaje" => "Horario de la ruta $numero actualizado."]);
        }

        $descripcion = trim($_POST["descripcion"] ?? "");
        $duracion = trim($_POST["duracion"] ?? "");
        $costo = trim($_POST["costo"] ?? "");
        $paraderos = (int)($_POST["paraderos"] ?? 0);
        if ($descripcion === "" || $duracion === "" || $costo === "" || $paraderos < 1) {
            responderRuta(["ok" => false, "mensaje" => "Completa descripción, duración, costo y paraderos."], 422);
        }
        if (mb_strlen($descripcion) > 255 || mb_strlen($duracion) > 30 || mb_strlen($costo) > 30) {
            responderRuta(["ok" => false, "mensaje" => "Alguno de los campos es demasiado largo."], 422);
        }
       
        $puntos = [];
        foreach (preg_split('/\s*;\s*/', trim($_POST["coordenadas"] ?? ""), -1, PREG_SPLIT_NO_EMPTY) as $par) {
            if (!preg_match('/^(?:([^:;<>]{1,60}?)\s*:\s*)?(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)$/u', $par, $m) || abs((float)$m[2]) > 90 || abs((float)$m[3]) > 180) {
                responderRuta(["ok" => false, "mensaje" => "Paradero no válido: \"$par\". Usa el formato Plaza de Bolívar: 5.0681,-75.5174; Cable Plaza: 5.0563,-75.4855"], 422);
            }
            $nombre = trim($m[1]);
            $puntos[] = ($nombre !== "" ? $nombre . ": " : "") . $m[2] . "," . $m[3];
        }
        if (count($puntos) > 100) responderRuta(["ok" => false, "mensaje" => "Máximo 100 paraderos en el mapa."], 422);
        $coordenadas = $puntos ? implode("; ", $puntos) : null;

        if ($accion === "editar") {
            $stmt = $conn->prepare("UPDATE rutas SET descripcion = ?, duracion = ?, costo = ?, paraderos = ?, estado = ?, salidas = ?, frecuencia = ?, coordenadas = ? WHERE numero = ?");
            $stmt->bind_param("sssisssss", $descripcion, $duracion, $costo, $paraderos, $estado, $salidas, $frecuencia, $coordenadas, $numero);
            $stmt->execute();
            responderRuta(["ok" => true, "mensaje" => "Ruta $numero actualizada."]);
        }

        $stmt = $conn->prepare("INSERT INTO rutas (numero, descripcion, duracion, costo, paraderos, estado, link, salidas, frecuencia, coordenadas) VALUES (?, ?, ?, ?, ?, ?, 'mapa.html', ?, ?, ?)");
        $stmt->bind_param("ssssissss", $numero, $descripcion, $duracion, $costo, $paraderos, $estado, $salidas, $frecuencia, $coordenadas);
        $stmt->execute();
        responderRuta(["ok" => true, "mensaje" => "Ruta $numero creada correctamente."]);
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
