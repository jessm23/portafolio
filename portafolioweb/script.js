// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// 🔹 Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD297PAKPfVGMH8JlU1clHR8bkuqSWOdGg",
  authDomain: "portafolio-ff27e.firebaseapp.com",
  databaseURL: "https://portafolio-ff27e-default-rtdb.firebaseio.com",
  projectId: "portafolio-ff27e",
  storageBucket: "portafolio-ff27e.appspot.com", // ⚠️ corregido
  messagingSenderId: "1097811914710",
  appId: "1:1097811914710:web:42d906a86cf31b889bbe77",
  measurementId: "G-TK9X8N30JD"
};

// 🔹 Inicializar Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Exportar servicios
export const db = getDatabase(app);
export const storage = getStorage(app);
