import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB4OFajtU-bKi7wuN5B1N_1x71hDo4nf8U",
  authDomain: "alarmaswof.firebaseapp.com",
  databaseURL: "https://alarmaswof-default-rtdb.firebaseio.com",
  projectId: "alarmaswof",
  storageBucket: "alarmaswof.appspot.com",
  messagingSenderId: "xxxx",
  appId: "1:xxxx:web:xxxx"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);

signInWithEmailAndPassword(auth, "nanedj@gmail.com", "charlie12")
  .then(() => {
    const relayRef = ref(db, "/relay1");
    const salidaRef = ref(db, "/salida");

    function updateEstadoUI(value) {
      document.getElementById("estado").textContent = value ? "ACTIVADA" : "DESACTIVADA";
    }

    function updateUsuarioUI(data) {
      const usuarioEl = document.getElementById("usuario");
      if (data && data.nombre && data.direccion) {
        usuarioEl.textContent = `${data.nombre} (${data.direccion})`;
      } else {
        usuarioEl.textContent = "Desconocido";
      }
    }

    onValue(relayRef, (snapshot) => updateEstadoUI(snapshot.val()));
    onValue(salidaRef, (snapshot) => updateUsuarioUI(snapshot.val()));

    window.toggleRelay = function() {
      onValue(relayRef, (snapshot) => {
        const current = snapshot.val();
        set(relayRef, !current);
      }, { onlyOnce: true });
    };
  })
  .catch((error) => {
    console.error("Error de autenticación:", error.message);
    alert("No se pudo conectar a Firebase. Verifica correo/clave.");
  });
