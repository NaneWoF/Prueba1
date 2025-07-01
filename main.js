import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getDatabase, ref, onValue, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js";
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
const dbRef = ref(db);

window.login = function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      document.getElementById("login-container").style.display = "none";
      document.getElementById("panel-container").style.display = "block";

      const relayRef = ref(db, "/relay1");
      const salidaRef = ref(db, "/salida");

      onValue(relayRef, (snapshot) => {
        document.getElementById("estado").textContent = snapshot.val() ? "ACTIVADA" : "DESACTIVADA";
      });

      onValue(salidaRef, (snapshot) => {
        const data = snapshot.val();
        const usuarioEl = document.getElementById("usuario");
        if (data && data.nombre && data.direccion) {
          usuarioEl.textContent = `${data.nombre} (${data.direccion})`;
        } else {
          usuarioEl.textContent = "Desconocido";
        }
      });
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
};

window.verificarIDWeb = function() {
  const idWeb = prompt("Ingrese su ID Web");
  if (!idWeb) return;

  get(child(dbRef, "/transmisores"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        // Convertir a array real para que funcione find()
        const lista = Object.values(snapshot.val());
        const encontrado = lista.find(t => t.idWeb === idWeb);
        if (encontrado) {
          const relayRef = ref(db, "/relay1");
          const salidaRef = ref(db, "/salida");

          onValue(relayRef, (snap) => {
            const current = snap.val();
            set(relayRef, !current);
            set(salidaRef, encontrado);
          }, { onlyOnce: true });
        } else {
          alert("ID Web no registrado");
        }
      } else {
        alert("No hay transmisores registrados");
      }
    })
    .catch((error) => {
      console.error(error);
      alert("Error al verificar ID Web");
    });
};
