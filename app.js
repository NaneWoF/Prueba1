
// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyB4OFajtU-bKi7wuN5B1N_1x71hDo4nf8U",
  authDomain: "alarmaswof.firebaseapp.com",
  databaseURL: "https://alarmaswof-default-rtdb.firebaseio.com",
  projectId: "alarmaswof",
  storageBucket: "alarmaswof.appspot.com",
  messagingSenderId: "tu-messaging-sender-id",
  appId: "tu-app-id"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

let currentUser = null;
let transmisores = {};
let salidaActiva = false;
let ultimoNombre = "";
let ultimaDireccion = "";

function $(id) { return document.getElementById(id); }
function showError(msg) { $("content").innerHTML = `<p class="error">${msg}</p>`; }
function showSuccess(msg) { $("content").innerHTML = `<p class="success">${msg}</p>`; }

function fetchEstadoSistema() {
  db.ref("/").on("value", (snapshot) => {
    const data = snapshot.val() || {};
    salidaActiva = data.relay1 || false;
    ultimoNombre = data.ultimoNombre || "";
    ultimaDireccion = data.ultimaDireccion || "";
    transmisores = data.transmisores || {};
    if ($("estadoSalida")) $("estadoSalida").innerText = salidaActiva ? "ACTIVADA" : "DESACTIVADA";
    if ($("content").innerHTML.includes("Último usuario")) {
      $("content").querySelector("p:nth-of-type(2)").innerHTML = `<strong>Último usuario:</strong> ${ultimoNombre || "Ninguno"}`;
      $("content").querySelector("p:nth-of-type(3)").innerHTML = `<strong>Dirección:</strong> ${ultimaDireccion || "-"}`;
    }
  });
}

function activarSalida(idWeb) {
  const transmisorEncontrado = Object.values(transmisores).find(t => t.idWeb === idWeb);
  if (!transmisorEncontrado) {
    $("msgActivar").innerHTML = `<p class="error">ID Web no registrado.</p>`;
    return;
  }
  const nuevoEstado = !salidaActiva;
  const updates = {
    "/relay1": nuevoEstado,
    "/ultimoNombre": transmisorEncontrado.nombre,
    "/ultimaDireccion": transmisorEncontrado.direccion
  };
  db.ref().update(updates)
    .then(() => {
      $("msgActivar").innerHTML = `<p class="success">Salida ${nuevoEstado ? "ACTIVADA" : "DESACTIVADA"} correctamente.</p>`;
    })
    .catch((err) => {
      $("msgActivar").innerHTML = `<p class="error">Error al actualizar: ${err.message}</p>`;
    });
}

function renderHome() {
  const content = $("content");
  content.innerHTML = `
    <h2>Estado del Sistema</h2>
    <p><strong>Salida:</strong> <span id="estadoSalida">${salidaActiva ? "ACTIVADA" : "DESACTIVADA"}</span></p>
    <p><strong>Último usuario:</strong> ${ultimoNombre || "Ninguno"}</p>
    <p><strong>Dirección:</strong> ${ultimaDireccion || "-"}</p>
    <h3>Activar/Desactivar Salida</h3>
    <form id="formActivar">
      <label for="inputIdWeb">Ingrese su ID Web:</label>
      <input type="text" id="inputIdWeb" required />
      <input type="submit" value="Enviar" />
    </form>
    <div id="msgActivar"></div>
  `;
  $("formActivar").onsubmit = e => {
    e.preventDefault();
    const idWeb = $("inputIdWeb").value.trim();
    if (!idWeb) {
      $("msgActivar").innerHTML = `<p class="error">Debe ingresar un ID Web.</p>`;
      return;
    }
    activarSalida(idWeb);
  };
}

function renderPage() {
  renderHome();
}
window.onload = () => {
  renderPage();
  fetchEstadoSistema();
};
