document.querySelectorAll(".btn-fav").forEach(btn => {
  btn.addEventListener("click", function() {
    let rutaNumero = this.getAttribute("data-ruta");

    Swal.fire({
      icon: "success",
      title: "Ruta guardada",
      text: `La ruta ${rutaNumero} se ha añadido a tus favoritos`,
      showConfirmButton: false,
      timer: 2000
    });
  });
});
