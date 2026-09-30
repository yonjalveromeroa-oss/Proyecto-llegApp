document.getElementById("registroForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let nombre = document.getElementById("nombre");
  let correo = document.getElementById("correo");
  let colegio = document.getElementById("colegio");
  let password = document.getElementById("password");
  let terminos = document.getElementById("terminos");

 
  [nombre, correo, colegio, password].forEach(input => input.classList.remove("error"));

  let errores = [];

  if (nombre.value.trim() === "") {
    errores.push("El nombre es obligatorio");
    nombre.classList.add("error");
  }

  if (correo.value.trim() === "") {
    errores.push("El correo es obligatorio");
    correo.classList.add("error");
  }

  if (colegio.value.trim() === "") {
    errores.push("El colegio es obligatorio");
    colegio.classList.add("error");
  }

  if (password.value.trim() === "") {
    errores.push("La contraseña es obligatoria");
    password.classList.add("error");
  }

  if (!terminos.checked) {
    errores.push("Debes aceptar los términos y condiciones");
  }

  
  if (errores.length > 0) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      html: errores.join("<br>"),
    });
    return;
  }

 
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Cuenta creada correctamente",
    showConfirmButton: false,
    timer: 1500
  });

  setTimeout(() => {
    window.location.href = "home.html";
  }, 1500);
});
