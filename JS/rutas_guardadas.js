// rutas_guardadas.js — muestra las rutas guardadas del usuario y, si es administrador, permite crear rutas

async function cargarRutasGuardadas() {
  const contenedor = document.getElementById("lista-rutas");
  let datos;
  try {
    datos = await (await fetch("../PHP/rutas.php")).json();
  } catch (error) {
    contenedor.innerHTML = "<p>No se pudieron cargar las rutas.</p>";
    return;
  }

  if (!datos.ok) {
    contenedor.innerHTML = '<p>Debes <a href="inicio_sesion.html">iniciar sesión</a> para ver tus rutas guardadas.</p>';
    return;
  }

  // El formulario de creación solo aparece para administradores
  document.getElementById("crear-ruta").hidden = datos.rol !== "admin";

  const rutas = datos.rutas;
  if (rutas.length === 0) {
    contenedor.innerHTML = '<p>No tienes rutas guardadas aún. <a href="encuentra_tu_ruta.html">Busca una ruta</a> y guárdala.</p>';
    return;
  }

  contenedor.innerHTML = rutas.map(ruta => `
    <div class="route-card">
      <h3>Ruta ${esc(ruta.numero)}</h3>
      <p>${esc(ruta.descripcion)}</p>
      <p><strong>Duración:</strong> ${esc(ruta.duracion)}</p>
      <p><strong>Costo:</strong> ${esc(ruta.costo)}</p>
      <p><strong>Paraderos:</strong> ${esc(ruta.paraderos)}</p>
      <p class="status ${claseEstado(ruta.estado)}">${esc(ruta.estado)}</p>
      <button class="btn" onclick="window.location.href='mapa.html?numero=${encodeURIComponent(ruta.numero)}'">Ver ruta</button>
      <button class="btn-fav" data-ruta="${esc(ruta.numero)}">🗑 Quitar</button>
    </div>
  `).join("");

  contenedor.querySelectorAll(".btn-fav").forEach(btn => {
    btn.addEventListener("click", () => quitarRuta(btn.dataset.ruta));
  });
}

async function quitarRuta(numero) {
  await fetch("../PHP/rutas.php", {
    method: "DELETE",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "numero=" + encodeURIComponent(numero)
  });
  cargarRutasGuardadas();
}

document.getElementById("formCrearRuta").addEventListener("submit", async function (e) {
  e.preventDefault();

  const datos = new FormData(this);
  datos.append("accion", "crear");

  let resultado;
  try {
    resultado = await (await fetch("../PHP/rutas.php", { method: "POST", body: datos })).json();
  } catch (error) {
    resultado = { ok: false, mensaje: "No se pudo conectar con el servidor." };
  }

  Swal.fire({
    icon: resultado.ok ? "success" : "error",
    title: resultado.ok ? "Ruta creada" : "No se pudo crear la ruta",
    text: resultado.mensaje
  });

  if (resultado.ok) this.reset();
});

cargarRutasGuardadas();
