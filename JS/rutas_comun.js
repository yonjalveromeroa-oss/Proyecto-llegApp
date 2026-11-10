// Funciones compartidas para mostrar rutas que vienen de la base de datos.

// Evita que un texto de la base se interprete como HTML
function esc(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}

// Clase CSS según el estado de la ruta (retraso, en-servicio, fuera-servicio)
function claseEstado(estado) {
  const e = (estado || "").toLowerCase();
  if (e.includes("fuera")) return "fuera-servicio";
  if (e.includes("retraso")) return "retraso";
  return "en-servicio";
}

async function obtenerRutas() {
  const resp = await fetch("../PHP/rutas.php?accion=catalogo");
  const datos = await resp.json();
  if (!datos.ok) throw new Error(datos.mensaje);
  return datos.rutas;
}

async function obtenerRutasGuardadas() {
  const resp = await fetch("../PHP/rutas.php");
  const datos = await resp.json();
  return datos.ok ? datos.rutas : null; // null = no ha iniciado sesión
}

async function guardarRutaFavorita(numero) {
  const datos = new FormData();
  datos.append("numero", numero);
  const resp = await fetch("../PHP/rutas.php", { method: "POST", body: datos });
  const resultado = await resp.json();
  Swal.fire({
    icon: resultado.ok ? "success" : "warning",
    title: resultado.ok ? "Ruta guardada" : "No se pudo guardar",
    text: resultado.ok ? `La ruta ${numero} se ha añadido a tus favoritos` : resultado.mensaje,
    showConfirmButton: !resultado.ok,
    timer: resultado.ok ? 2000 : undefined
  });
}

// ---- Sesión ----

// Devuelve { ok, nombre, rol } del usuario que inició sesión
async function obtenerSesion() {
  try {
    return await (await fetch("../PHP/usuarios.php?accion=sesion")).json();
  } catch (error) {
    return { ok: false };
  }
}

// Para páginas solo de administrador: si no lo es, lo manda al login
async function exigirAdmin() {
  const sesion = await obtenerSesion();
  if (!sesion.ok || sesion.rol !== "admin") {
    window.location.replace("inicio_sesion.html");
    throw new Error("Se requiere una cuenta administradora");
  }
  return sesion;
}

async function cerrarSesion() {
  const datos = new FormData();
  datos.append("accion", "logout");
  await fetch("../PHP/usuarios.php", { method: "POST", body: datos });
  window.location.href = "inicio_sesion.html";
}

// Distancia aproximada en km entre dos puntos [lat, lng]
function distanciaKm(a, b) {
  const rad = x => x * Math.PI / 180;
  const dLat = rad(b[0] - a[0]), dLng = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

// Convierte "lat,lng; lat,lng" (columna rutas.coordenadas) en [[lat, lng], ...]
function leerCoordenadas(texto) {
  return (texto || "").split(";")
    .map(par => par.split(",").map(Number))
    .filter(p => p.length === 2 && p.every(Number.isFinite));
}
