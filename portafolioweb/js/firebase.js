// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-storage.js";

// 🔹 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD297PAKPfVGMH8JlU1clHR8bkuqSWOdGg",
  authDomain: "portafolio-ff27e.firebaseapp.com",
  databaseURL: "https://portafolio-ff27e-default-rtdb.firebaseio.com",
  projectId: "portafolio-ff27e",
  storageBucket: "portafolio-ff27e.appspot.com",
  messagingSenderId: "1097811914710",
  appId: "1:1097811914710:web:42d906a86cf31b889bbe77",
  measurementId: "G-TK9X8N30JD"
};

// 🔹 Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

// 🔹 Exportar para usar en otras partes
export { app, db, storage };
