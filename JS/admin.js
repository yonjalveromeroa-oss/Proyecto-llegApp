window.addEventListener("DOMContentLoaded", () => {
  const contador = document.getElementById("contador-novedades");
  const novedades = JSON.parse(localStorage.getItem("novedades")) || [];

  // Actualizar solo el contador
  contador.textContent = novedades.length;
});

// Mantener tus funciones de editar/eliminar usuarios
document.querySelectorAll(".editar").forEach(btn => {
  btn.addEventListener("click", function() {
    window.location.href = "editar_tu_perfil.html";
  });
});

document.querySelectorAll(".eliminar").forEach(btn => {
  btn.addEventListener("click", function() {
    const fila = this.closest("tr"); // obtener la fila del usuario

    Swal.fire({
      icon: "warning",
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(result => {
      if (result.isConfirmed) {
        // eliminar la fila del DOM
        fila.remove();

        // actualizar contador de usuarios registrados
        const usuariosRegistrados = document.querySelector(".stats .card:nth-child(1) p");
        const totalUsuarios = document.querySelectorAll(".users tbody tr").length;
        usuariosRegistrados.textContent = totalUsuarios;

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
