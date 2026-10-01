window.addEventListener("DOMContentLoaded", () => {
  // contador de novedades
  const contador = document.getElementById("contador-novedades");
  const novedades = JSON.parse(localStorage.getItem("novedades")) || [];
  contador.textContent = novedades.length;

  // mostrar usuarios guardados en localStorage
  const tbody = document.querySelector(".users tbody");
  tbody.innerHTML = ""; // limpiar tabla

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  usuarios.forEach(usuario => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${usuario.nombre}</td>
      <td>${usuario.correo}</td>
      <td>${usuario.colegio}</td>
      <td>${usuario.estado}</td>
      <td>
        <button class="editar">Editar</button>
        <button class="eliminar">Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });

  // actualizar contador de usuarios registrados
  const usuariosRegistrados = document.getElementById("contador-usuarios");
  usuariosRegistrados.textContent = usuarios.length;

  // enlazar botones de editar
  document.querySelectorAll(".editar").forEach(btn => {
    btn.addEventListener("click", function() {
      window.location.href = "editar_tu_perfil.html";
    });
  });

  // enlazar botones de eliminar
  document.querySelectorAll(".eliminar").forEach(btn => {
    btn.addEventListener("click", function() {
      const fila = this.closest("tr");
      const correo = fila.children[1].textContent; // identificar usuario por correo

      Swal.fire({
        icon: "warning",
        title: "¿Eliminar usuario?",
        text: "Esta acción no se puede deshacer",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      }).then(result => {
        if (result.isConfirmed) {
          fila.remove();

          // eliminar del localStorage
          let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
          usuarios = usuarios.filter(u => u.correo !== correo);
          localStorage.setItem("usuarios", JSON.stringify(usuarios));

          // actualizar contador
          usuariosRegistrados.textContent = usuarios.length;

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
});
