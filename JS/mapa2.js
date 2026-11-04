document.getElementById("guardarRuta").addEventListener("click", function() {

  let guardarRuta = document.getElementById("guardarRuta");
 

[correo, password].forEach(input => input.classList.remove("error"));
  Swal.fire({
    icon: "success",
    title: "Ruta guardada",
    text: "La Ruta 132 se ha añadido a tus favoritos",
    showConfirmButton: false,
    timer: 2000
  });
});

let estadoRuta = "En servicio";

if (estadoRuta === "en servicio") {
  Swal.fire({
    icon: "error",
    title: "Ruta no disponible",
    text: "La Ruta 132 está en servicio actualmente"
  });
} else if (estadoRuta === "en servicio") {
  Swal.fire({
    icon: "warning",
    title: "Ruta con retraso",
    text: "La Ruta 132 esta en servicio"
  });
}

