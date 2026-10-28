// rutas_guardadas.js

function cargarRutasGuardadas() {
  let rutas = JSON.parse(localStorage.getItem("rutasFavoritas")) || [];
  let contenedor = document.getElementById("lista-rutas");
  contenedor.innerHTML = "";

  if (rutas.length === 0) {
    contenedor.innerHTML = "<p>No tienes rutas guardadas aún.</p>";
    return;
  }

  rutas.forEach(ruta => {
    let card = document.createElement("div");
    card.classList.add("route-card");
    card.innerHTML = `
      <h3>Ruta ${ruta.numero}</h3>
      <p>${ruta.descripcion}</p>
      <p><strong>Duración:</strong> ${ruta.duracion}</p>
      <p><strong>Costo:</strong> ${ruta.costo}</p>
      <p><strong>Paraderos:</strong> ${ruta.paraderos}</p>
      <p><strong>Estado:</strong> ${ruta.estado}</p>
      <button class="btn" onclick="window.location.href='${ruta.link}'">Ver ruta</button>
    `;
    contenedor.appendChild(card);
  });
}

// Ejecutar al cargar la página
cargarRutasGuardadas();
