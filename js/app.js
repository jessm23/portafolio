// 📂 js/app.js
import { db, storage } from "./firebase.js";
import { ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { ref as sRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Formulario
const uploadForm = document.getElementById("uploadForm");
const proyectosLista = document.getElementById("proyectosLista");

// Subir proyecto
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = e.target.titulo.value;
  const descripcion = e.target.descripcion.value;
  const archivo = e.target.archivo.files[0];

  if (!archivo) {
    alert("Por favor selecciona un archivo");
    return;
  }

  try {
    // 🔹 Ruta interna en Storage
    const archivoPath = "proyectos/" + Date.now() + "_" + archivo.name;
    const archivoRef = sRef(storage, archivoPath);

    // 🔹 Subir archivo
    await uploadBytes(archivoRef, archivo);

    // 🔹 Obtener URL pública
    const archivoURL = await getDownloadURL(archivoRef);

    // 🔹 Guardar en la base de datos
    const proyectosRef = ref(db, "proyectos");
    const nuevoProyectoRef = push(proyectosRef);

    await set(nuevoProyectoRef, {
      titulo,
      descripcion,
      archivoNombre: archivo.name,
      archivoURL,
      archivoPath, // importante para borrar
      fecha: new Date().toLocaleString()
    });

    alert("✅ Proyecto subido con éxito!");
    uploadForm.reset();

  } catch (error) {
    console.error("Error al subir:", error);
    alert("❌ Error al subir proyecto");
  }
});

// Mostrar proyectos
const proyectosRef = ref(db, "proyectos");
onValue(proyectosRef, (snapshot) => {
  proyectosLista.innerHTML = "";
  snapshot.forEach((child) => {
    const proyecto = child.val();
    const key = child.key;

    const div = document.createElement("div");
    div.classList.add("col-md-4");

    div.innerHTML = `
      <div class="card shadow border-0 rounded-3 h-100">
        <div class="card-body">
          <h5 class="card-title text-primary">${proyecto.titulo}</h5>
          <p class="card-text">${proyecto.descripcion}</p>
          <a href="${proyecto.archivoURL}" target="_blank" class="btn btn-sm btn-success">
            <i class="bi bi-download"></i> Descargar
          </a>
          <button class="btn btn-sm btn-danger ms-2" data-id="${key}">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </div>
      </div>
    `;

    proyectosLista.appendChild(div);

    // Eliminar proyecto
    div.querySelector("button").addEventListener("click", async () => {
      if (confirm("¿Eliminar este proyecto?")) {
        try {
          // 🔹 Eliminar archivo de Storage
          if (proyecto.archivoPath) {
            const fileRef = sRef(storage, proyecto.archivoPath);
            await deleteObject(fileRef);
          }
          // 🔹 Eliminar de Realtime Database
          await remove(ref(db, "proyectos/" + key));
          alert("✅ Proyecto eliminado");
        } catch (err) {
          console.error("Error al eliminar:", err);
          alert("❌ Error al eliminar proyecto");
        }
      }
    });
  });
});
