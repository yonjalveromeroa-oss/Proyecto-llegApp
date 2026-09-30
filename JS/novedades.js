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
  localStorage.setItem("ultimaNovedad", JSON.stringify(novedad));


  Swal.fire({
    icon: "success",
    title: "Novedad enviada",
    text: "Tu reporte ha sido enviado al administrador",
    showConfirmButton: true
  });
});
