// rutas_guardadas.js — muestra las rutas guardadas del usuario desde la base de datos

async function cargarRutasGuardadas() {
  const contenedor = document.getElementById("lista-rutas");
  const rutas = await obtenerRutasGuardadas();

  if (rutas === null) {
    contenedor.innerHTML = '<p>Debes <a href="inicio_sesion.html">iniciar sesión</a> para ver tus rutas guardadas.</p>';
    return;
  }
  if (rutas.length === 0) {
    contenedor.innerHTML = "<p>No tienes rutas guardadas aún.</p>";
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
      <button class="btn-fav" onclick="quitarRuta('${esc(ruta.numero)}')">🗑 Quitar</button>
    </div>
  `).join("");
}

async function quitarRuta(numero) {
  await fetch("../PHP/rutas.php", {
    method: "DELETE",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "numero=" + encodeURIComponent(numero)
  });
  cargarRutasGuardadas();
}

cargarRutasGuardadas();
