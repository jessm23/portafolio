// js/app.js
import { db, storage } from "./firebase.js";
import { ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

const form = document.getElementById("uploadForm");
const proyectosLista = document.getElementById("proyectosLista");
const proyectosRef = ref(db, "proyectos");

// SUBIR proyecto
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = form.titulo.value;
  const descripcion = form.descripcion.value;
  const archivo = form.archivo.files[0];
  if (!archivo) return alert("Selecciona un archivo");

  // Ruta única en storage
  const archivoPath = "proyectos/" + Date.now() + "_" + archivo.name;
  const fileRef = storageRef(storage, archivoPath);

  // Subir archivo
  await uploadBytes(fileRef, archivo);
  const url = await getDownloadURL(fileRef);

  // Guardar en DB
  const proyecto = {
    titulo,
    descripcion,
    nombreArchivo: archivo.name,
    archivoURL: url,
    archivoPath, // ✅ se guarda para borrado
    fecha: new Date().toLocaleString()
  };

  await push(proyectosRef, proyecto);
  form.reset();
});

// MOSTRAR proyectos
onValue(proyectosRef, (snapshot) => {
  proyectosLista.innerHTML = "";
  snapshot.forEach((child) => {
    const proyecto = child.val();
    const id = child.key;

    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";
    col.innerHTML = `
      <div class="card shadow-lg border-0 rounded-4 h-100 bg-light text-dark">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title text-primary fw-bold">${proyecto.titulo}</h5>
          <p class="card-text">${proyecto.descripcion}</p>
          <small class="text-secondary">📅 ${proyecto.fecha}</small>
          <div class="mt-auto d-flex justify-content-between">
            <a href="${proyecto.archivoURL}" target="_blank" class="btn btn-info btn-sm rounded-pill">
              <i class="bi bi-eye"></i> Ver
            </a>
            <a href="${proyecto.archivoURL}" download="${proyecto.nombreArchivo}" class="btn btn-success btn-sm rounded-pill">
              <i class="bi bi-download"></i> Descargar
            </a>
            <button class="btn btn-danger btn-sm rounded-pill btnEliminar" data-id="${id}" data-path="${proyecto.archivoPath}">
              <i class="bi bi-trash"></i> Eliminar
            </button>
          </div>
        </div>
      </div>`;
    proyectosLista.appendChild(col);

    // ELIMINAR proyecto
    col.querySelector(".btnEliminar").addEventListener("click", async () => {
      if (confirm("¿Seguro que quieres eliminar este proyecto?")) {
        await remove(ref(db, "proyectos/" + id));

        // Eliminar de Storage
        if (proyecto.archivoPath) {
          const fileRef = storageRef(storage, proyecto.archivoPath);
          try {
            await deleteObject(fileRef);
          } catch (err) {
            console.error("Error al eliminar archivo:", err);
          }
        }
      }
    });
  });
});
