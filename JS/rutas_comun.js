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
