import fetch from "node-fetch";
import fs from "fs";
import path from "path";

// ⚠️ Configura tus datos
const token = fs.readFileSync("token.txt", "utf8").trim();
const owner = "jessm23";    // tu usuario de GitHub
const repo = "portafolio";     // nombre del repositorio
const branch = "main";         // rama principal (main o master)

// Función para subir un archivo
async function subirArchivo(localPath, remotePath, mensaje) {
  const content = fs.readFileSync(localPath, "base64");

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${remotePath}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: mensaje,
      content: content,
      branch: branch,
    }),
  });

  if (res.ok) {
    console.log(`✅ Archivo ${remotePath} subido correctamente`);
  } else {
    const error = await res.json();
    console.error("❌ Error al subir:", error);
  }
}

// 🔹 Función recursiva para subir todos los archivos y carpetas
async function subirProyecto(carpeta, nombreProyecto) {
  const items = fs.readdirSync(carpeta);

  for (const item of items) {
    const localPath = path.join(carpeta, item);
    const remotePath = path.join(nombreProyecto, item).replace(/\\/g, "/");

    if (fs.statSync(localPath).isDirectory()) {
      // si es carpeta, volvemos a llamar la función
      await subirProyecto(localPath, remotePath);
    } else {
      // si es archivo, lo subimos
      await subirArchivo(localPath, remotePath, `Agrego ${item} al proyecto ${nombreProyecto}`);
    }
  }
}

// 🔹 Subir todo el contenido de la carpeta actual (portafolioweb)
subirProyecto("./", "portafolioweb");
