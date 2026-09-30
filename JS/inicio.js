document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let correo = document.getElementById("correo");
  let password = document.getElementById("password");

  [correo, password].forEach(input => input.classList.remove("error"));

  let errores = [];

  if (correo.value.trim() === "") {
    errores.push("El correo es obligatorio");
    correo.classList.add("error");
  }

  if (password.value.trim() === "") {
    errores.push("La contraseña es obligatoria");
    password.classList.add("error");
  }

  if (errores.length > 0) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      html: errores.join("<br>")
    });
    return;
  }

  
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Inicio de sesión correcto",
    showConfirmButton: false,
    timer: 1500
  });

  setTimeout(() => {
    window.location.href = "home.html";
  }, 1500);
});
