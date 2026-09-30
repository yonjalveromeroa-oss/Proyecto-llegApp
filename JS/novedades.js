document.getElementById("formNovedades").addEventListener("submit", function(e) {
  e.preventDefault();

  const tipo = document.getElementById("tipo").value.trim();
  const comentarios = document.getElementById("comentarios").value.trim();

  if (tipo === "" || comentarios === "") {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Debes seleccionar un tipo de novedad y escribir un comentario"
    });
    return;
  }

  const novedad = {
    tipo,
    comentarios,
    fecha: new Date().toLocaleString()
  };

  // Recuperar novedades anteriores
  let novedades = JSON.parse(localStorage.getItem("novedades")) || [];
  novedades.push(novedad);

  // Guardar nuevamente en localStorage
  localStorage.setItem("novedades", JSON.stringify(novedades));

  Swal.fire({
    icon: "success",
    title: "Novedad enviada",
    text: "Tu reporte ha sido enviado al administrador",
    showConfirmButton: false,
    timer: 2000
  });

  // Redirigir al panel de administrador
  setTimeout(() => {
    window.location.href = "administrador.html";
  }, 2000);
});
