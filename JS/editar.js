document.getElementById("editarPerfilForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  let nombre = document.getElementById("nombre");
  let email = document.getElementById("email");
  let colegio = document.getElementById("colegio");
  let partida = document.getElementById("partida");
  let notificaciones = document.getElementById("notificaciones");

  [nombre, email, colegio, partida].forEach(input => input.classList.remove("error"));

  let errores = [];

  if (nombre.value.trim() === "") {
    errores.push("El nombre no puede estar vacío");
    nombre.classList.add("error");
  }

  if (email.value.trim() === "") {
    errores.push("El correo electrónico es obligatorio");
    email.classList.add("error");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    errores.push("El correo electrónico no es válido");
    email.classList.add("error");
  }

  if (colegio.value.trim() === "") {
    errores.push("El colegio es obligatorio");
    colegio.classList.add("error");
  }

  if (partida.value.trim() === "") {
    errores.push("El punto de partida es obligatorio");
    partida.classList.add("error");
  }

  if (errores.length > 0) {
    Swal.fire({
      icon: "error",
      title: "Errores en el formulario",
      html: errores.join("<br>")
    });
    return;
  }
  
const datos = new FormData();
datos.append("nombre", nombre.value.trim());
datos.append("email", email.value.trim());
datos.append("colegio", colegio.value.trim());
datos.append("partida", partida.value.trim());
datos.append("notificaciones", notificaciones.value);
await fetch("../PHP/perfiles.php", { method: "POST", body: datos });


  Swal.fire({
    icon: "success",
    title: "Perfil actualizado",
    text: "Tus cambios se han guardado correctamente",
    showConfirmButton: false,
    timer: 2000
  });

  setTimeout(() => {
    window.location.href = "perfil.html";
  }, 2000);
});
