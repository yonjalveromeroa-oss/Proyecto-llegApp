async function cargarPerfil() {
  try {
    const response = await fetch("../PHP/perfiles.php");
    const resultado = await response.json();
    if (!response.ok || !resultado.ok) throw new Error(resultado.mensaje || "No se pudo cargar el perfil.");
    const perfil = resultado.perfil;
    document.getElementById("perfil-iniciales").textContent = perfil.nombre.split(/\s+/).map(p => p[0]).join("").toUpperCase();
    document.getElementById("perfil-nombre").textContent = perfil.nombre;
    document.getElementById("perfil-email").textContent = `Email: ${perfil.email}`;
    document.getElementById("perfil-colegio").textContent = `Colegio: ${perfil.colegio}`;
    document.getElementById("perfil-partida").textContent = `Punto de partida: ${perfil.partida || "No indicado"}`;
    document.getElementById("perfil-notificaciones").textContent = `Notificaciones: ${perfil.notificaciones}`;
  } catch (error) {
    Swal.fire({ icon: "error", title: "No se pudo cargar el perfil", text: error.message });
  }
}

cargarPerfil();
