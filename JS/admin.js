// Mostrar la última novedad guardada como si fuera un correo
const novedadContainer = document.getElementById("novedad-container");
const novedad = localStorage.getItem("ultimaNovedad");

if (novedad && novedadContainer) {
  const data = JSON.parse(novedad);
  novedadContainer.innerHTML = `
    <div class="mensaje">
      <p><strong>De:</strong> Usuario del sistema</p>
      <p><strong>Tipo de novedad:</strong> ${data.tipo}</p>
      <p><strong>Comentario:</strong></p>
      <blockquote>${data.comentarios}</blockquote>
      <p><em>Fecha de envío:</em> ${data.fecha}</p>
    </div>
  `;
}

// Botón Editar → redirige a editar perfil
document.querySelectorAll(".editar").forEach(btn => {
  btn.addEventListener("click", function() {
    window.location.href = "editar_tu_perfil.html";
  });
});

// Botón Eliminar → confirmación con SweetAlert2
document.querySelectorAll(".eliminar").forEach(btn => {
  btn.addEventListener("click", function() {
    Swal.fire({
      icon: "warning",
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Usuario eliminado",
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  });
});
