document.getElementById("formNovedades").addEventListener("submit", function(e) {
  e.preventDefault();

  const tipo = document.getElementById("tipo").value.trim();
  const comentarios = document.getElementById("comentarios").value.trim();

  // Validaciones
  if (tipo === "" || comentarios === "") {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Debes seleccionar un tipo de novedad y escribir un comentario"
    });
    return;
  }

  // Guardar novedad en localStorage
  const novedad = {
    tipo,
    comentarios,
    fecha: new Date().toLocaleString()
  };
  localStorage.setItem("ultimaNovedad", JSON.stringify(novedad));

  // Alerta de éxito (sin redirección)
  Swal.fire({
    icon: "success",
    title: "Novedad enviada",
    text: "Tu reporte ha sido enviado al administrador",
    showConfirmButton: true
  });
});
