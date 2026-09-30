document.querySelectorAll(".btn-fav").forEach(btn => {
  btn.addEventListener("click", function() {
    let card = this.closest(".route-card");
    let ruta = card.querySelector("h3").textContent;
    let estado = card.querySelector(".status").textContent;

    Swal.fire({
      icon: estado.includes("Fuera") ? "error" : "success",
      title: "Favoritos",
      html: `<b>${ruta}</b> guardada en favoritos.<br>Estado actual: ${estado}`,
      timer: 2500,
      showConfirmButton: false
    });
  });
});
