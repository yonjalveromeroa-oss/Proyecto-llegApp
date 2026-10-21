document.addEventListener("DOMContentLoaded", () => {

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];


  document.getElementById("contador-usuarios").textContent = usuarios.length;


  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  usuarios.forEach((usuario, index) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${usuario.nombre}</td>
      <td>${usuario.correo}</td>
      <td>${usuario.colegio}</td>
      <td>${usuario.estado}</td>
      <td>
        <button onclick="eliminarUsuario(${index})">❌ Eliminar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
});


function eliminarUsuario(index) {
  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  usuarios.splice(index, 1);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  Swal.fire({
    icon: "success",
    title: "Usuario eliminado",
    showConfirmButton: false,
    timer: 1000
  });

  setTimeout(() => location.reload(), 1000);
}
