const form = document.getElementById("uploadForm");
const proyectosLista = document.getElementById("proyectosLista");

// Cargar proyectos guardados en LocalStorage
let proyectos = JSON.parse(localStorage.getItem("proyectos")) || [];

function mostrarProyectos() {
  proyectosLista.innerHTML = "";
  proyectos.forEach((p, index) => {
    proyectosLista.innerHTML += `
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-sm border-0 rounded-4 h-100 project-card">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-primary fw-bold">${p.titulo}</h5>
            <p class="card-text text-muted flex-grow-1">${p.descripcion}</p>
            <small class="text-secondary">📅 Subido el: ${p.fecha}</small>
            <div class="mt-3 d-flex justify-content-between">
              <a href="${p.archivo}" download="${p.nombreArchivo}" class="btn btn-success btn-sm rounded-pill">
                <i class="bi bi-download"></i> Descargar
              </a>
              <a href="${p.archivo}" target="_blank" class="btn btn-info btn-sm rounded-pill">
                <i class="bi bi-eye"></i> Ver
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

// Manejar subida de proyecto
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const titulo = form.titulo.value;
  const descripcion = form.descripcion.value;
  const archivoInput = form.archivo.files[0];

  if (!archivoInput) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const nuevoProyecto = {
      titulo,
      descripcion,
      nombreArchivo: archivoInput.name,
      archivo: event.target.result, // Base64
      fecha: new Date().toLocaleString()
    };

    proyectos.unshift(nuevoProyecto); // Agregar al inicio
    localStorage.setItem("proyectos", JSON.stringify(proyectos));
    mostrarProyectos();
    form.reset();
  };
  reader.readAsDataURL(archivoInput);
});

// Inicializar
mostrarProyectos();
