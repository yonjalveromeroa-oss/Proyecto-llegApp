
function esc(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}


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
  return datos.ok ? datos.rutas : null; 
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




async function obtenerSesion() {
  try {
    return await (await fetch("../PHP/usuarios.php?accion=sesion")).json();
  } catch (error) {
    return { ok: false };
  }
}


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


function distanciaKm(a, b) {
  const rad = x => x * Math.PI / 180;
  const dLat = rad(b[0] - a[0]), dLng = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}


const LUGARES_MANIZALES = {
  "Plaza de Bolívar": [5.0681, -75.5174],
  "Catedral Basílica": [5.0674, -75.5173],
  "Parque Caldas": [5.0676, -75.5127],
  "Fundadores": [5.0694, -75.5097],
  "Avenida Santander": [5.0680, -75.5106],
  "Universidad de Caldas": [5.0556, -75.4939],
  "Estadio Palogrande": [5.0570, -75.4907],
  "Cable Plaza": [5.0563, -75.4855],
  "El Cable": [5.0563, -75.4864],
  "Mall Plaza": [5.0658, -75.4903],
  "Terminal de Transportes": [5.0494, -75.5063],
  "Sancancio": [5.0477, -75.4923],
  "Milán": [5.0459, -75.4799],
  "La Enea": [5.0318, -75.4631],
  "Aeropuerto La Nubia": [5.0296, -75.4641],
  "Chipre": [5.0758, -75.5254],
  "Monumento a los Colonizadores": [5.0769, -75.5278],
  "Parque del Agua": [5.0671, -75.5236]
};

const sinTildes = t => (t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();


function leerParaderos(texto) {
  return (texto || "").split(";").map(parte => {
    const i = parte.lastIndexOf(":");
    const nombre = i >= 0 ? parte.slice(0, i).trim() : "";
    const punto = parte.slice(i + 1).split(",").map(Number);
    return { nombre, punto };
  }).filter(p => p.punto.length === 2 && p.punto.every(Number.isFinite));
}


function leerCoordenadas(texto) {
  return leerParaderos(texto).map(p => p.punto);
}


async function buscarLugar(nombre) {
  const conocido = Object.keys(LUGARES_MANIZALES).find(l => sinTildes(l) === sinTildes(nombre));
  if (conocido) return { nombre: conocido, punto: LUGARES_MANIZALES[conocido] };
  try {
    const url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&bounded=1" +
      "&viewbox=-75.56,5.10,-75.42,5.00&q=" + encodeURIComponent(nombre + ", Manizales");
    const [lugar] = await (await fetch(url)).json();
    if (lugar) return { nombre, punto: [+(+lugar.lat).toFixed(5), +(+lugar.lon).toFixed(5)] };
  } catch (error) { /* sin conexión: se informa abajo */ }
  return null;
}


async function prepararParaderos(texto) {
  const partes = (texto || "").split(";").map(p => p.trim()).filter(Boolean);
  const resultado = [];
  for (const parte of partes) {
    const i = parte.lastIndexOf(":");
    const posibleCoord = parte.slice(i + 1).trim();
    if (/^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(posibleCoord)) {
      const nombre = i >= 0 ? parte.slice(0, i).trim() : "";
      resultado.push((nombre ? nombre + ": " : "") + posibleCoord.replace(/\s+/g, ""));
      continue;
    }
    const lugar = await buscarLugar(parte);
    if (!lugar) return { ok: false, mensaje: `No encontramos "${parte}" en Manizales. Escribe otro nombre o agrega la coordenada así: ${parte}: 5.0681,-75.5174` };
    resultado.push(lugar.nombre + ": " + lugar.punto.join(","));
  }
  return { ok: true, texto: resultado.join("; ") };
}
