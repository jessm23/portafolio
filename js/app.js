// js/app.js
import { db, storage } from "./firebase.js";
import { ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";

const form = document.getElementById("uploadForm");
const proyectosLista = document.getElementById("proyectosLista");
const proyectosRef = ref(db, "proyectos");

// Subir proyecto
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = form.titulo.value;
  const descripcion = form.descripcion.value;
  const archivo = form.archivo.files[0];
  if (!archivo) return alert("Selecciona un archivo");

  // Ruta única en Storage
  const archivoPath = "proyectos/" + Date.now() + "_" + archivo.name;
  const archivoRef = storageRef(storage, archivoPath);

  await uploadBytes(archivoRef, archivo);
  const url = await getDownloadURL(archivoRef);

  const proyecto = {
    titulo,
    descripcion,
    archivoNombre: archivo.name,
    archivoURL: url,
    archivoPath,
    fecha: new Date().toLocaleString()
  };

  await push(proyectosRef, proyecto);
  form.reset();
});

// Mostrar proyectos
onValue(proyectosRef, (snapshot) => {
  proyectosLista.innerHTML = "";
  snapshot.forEach((child) => {
    const proyecto = child.val();
    const id = child.key;

    proyectosLista.innerHTML += `
      <div class="col-md-6 col-lg-4">
        <div class="card shadow-lg border-0 rounded-4 h-100 bg-light text-dark">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title text-primary fw-bold">${proyecto.titulo}</h5>
            <p class="card-text">${proyecto.descripcion}</p>
            <small class="text-secondary">📅 ${proyecto.fecha}</small>
            <div class="mt-auto d-flex justify-content-between">
              <a href="${proyecto.archivoURL}" target="_blank" class="btn btn-info btn-sm rounded-pill">
                <i class="bi bi-eye"></i> Ver
              </a>
              <a href="${proyecto.archivoURL}" download="${proyecto.archivoNombre}" class="btn btn-success btn-sm rounded-pill">
                <i class="bi bi-download"></i> Descargar
              </a>
              <button class="btn btn-danger btn-sm rounded-pill" onclick="eliminarProyecto('${id}', '${proyecto.archivoPath}')">
                <i class="bi bi-trash"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>`;
  });
});

// Eliminar proyecto
window.eliminarProyecto = async function(id, archivoPath) {
  await remove(ref(db, "proyectos/" + id));
  if (archivoPath) {
    try {
      await deleteObject(storageRef(storage, archivoPath));
    } catch (e) {
      console.error("Error al eliminar archivo:", e);
    }
  }
};
