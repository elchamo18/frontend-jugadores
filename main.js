const formularioCrear = document.querySelector("#crear-jugador");
const formularioEditar = document.querySelector("#editar-jugador");
const contenedorAsideEditar = document.querySelector(".editar");
const contenedorJugadores = document.querySelector(".jugadores");

function obtenerJugadores() {
  fetch("https://api-jugadores-dev.2.us-1.fl0.io/jugadores")
    .then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error("Error en la llamada a la API");
      }
      return respuesta.json();
    })
    .then((jugadores) => {
      jugadores.forEach((jugador) => {
        pintarJugadorEnDOM(jugador);
      });
    })
    .catch((error) => {
      console.log(error);
      alerta("No se pudo obtener los jugadores");
    });
}

function crearJugador(jugador) {
  fetch("https://api-jugadores-dev.2.us-1.fl0.io/jugadores", {
    method: "POST",
    body: JSON.stringify(jugador),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error("No se pudo crear el jugador");
      }
      return respuesta.json();
    })
    .then(({ message, body: jugador }) => {
      pintarJugadorEnDOM(jugador);
      formularioCrear.reset();
      alerta(message);
    })
    .catch((error) => {
      console.log(error);
      alerta("No se pudo crear el jugador");
    });
}

function pintarJugadorEnDOM(jugador) {
  const jugadorHTML = document.createElement("div");
  jugadorHTML.classList.add("jugador");
  jugadorHTML.setAttribute("data-nombre", jugador.nombre);
  jugadorHTML.setAttribute("data-edad", jugador.edad);
  jugadorHTML.setAttribute("data-salario", jugador.salario);
  jugadorHTML.id = jugador.id_jugador;
  jugadorHTML.innerHTML = `
  <img src="imagen jugadores.png" alt="Escudo del America" />
  <h2>Jugador ${jugador.id_jugador}</h2>
  <p>Nombre: ${jugador.nombre}</p>
  <p>Edad: ${jugador.edad} años</p>
  <p>Salario: $${jugador.salario}</p>
  <button id="editar">Editar</button>
  <button id="eliminar">Eliminar</button>`;
  contenedorJugadores.appendChild(jugadorHTML);
}

function eliminarJugador(id) {
  fetch(`https://api-jugadores-dev.2.us-1.fl0.io/jugadores/${id}`, {
    method: "DELETE",
  })
    .then((respuesta) => {
      if (respuesta.status === 204) {
        const jugador = document.getElementById(id);
        jugador.remove();
        alerta("Jugador eliminado");
        return;
      }
      throw new Error("No se pudo eliminar el jugador");
    })
    .catch((error) => {
      console.log(error);
      alerta("No se pudo eliminar el jugador");
    });
}

function modificarJugadorEnDOM(jugador) {
  const jugadorHTML = document.getElementById(jugador.id_jugador);
  jugadorHTML.setAttribute("data-nombre", jugador.nombre);
  jugadorHTML.setAttribute("data-edad", jugador.edad);
  jugadorHTML.setAttribute("data-salario", jugador.salario);
  jugadorHTML.innerHTML = `
  <img src="imagen jugadores.png" alt="Escudo del America" />
  <h2>Jugador ${jugador.id_jugador}</h2>
  <p>Nombre: ${jugador.nombre}</p>
  <p>Edad: ${jugador.edad} años</p>
  <p>Salario: $${jugador.salario}</p>
  <button id="editar">Editar</button>
  <button id="eliminar">Eliminar</button>`;
}

function alerta(message) {
  const alertContainer = document.getElementById("alertContainer");

  const alertElement = document.createElement("div");
  alertElement.classList.add("alert");
  alertElement.textContent = message;
  alertContainer.appendChild(alertElement);

  alertElement.style.display = "block";

  setTimeout(function () {
    alertElement.style.display = "none";
    alertElement.remove();
  }, 3000);
}

let jugadorEditando = null;

function cargarDatosEnFormulario(jugador) {
  formularioEditar.elements.nombre.value = jugador.nombre;
  formularioEditar.elements.edad.value = jugador.edad;
  formularioEditar.elements.salario.value = jugador.salario;
  formularioEditar.setAttribute("data-id", jugador.id_jugador);
}

function editarJugador(jugador) {
  fetch(
    `https://api-jugadores-dev.2.us-1.fl0.io/jugadores/${jugador.id_jugador}`,
    {
      method: "PUT",
      body: JSON.stringify(jugador),
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error("No se pudo editar el jugador");
      }
      return respuesta.json();
    })
    .then(({ message, body: jugador }) => {
      modificarJugadorEnDOM(jugador);
      formularioEditar.reset();
      alerta(message);
    });
}

// Delegación de eventos

// Evento DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  obtenerJugadores();
});

// Evento submit
document.addEventListener("submit", (evento) => {
  evento.preventDefault();
  if (evento.target.matches("#crear-jugador")) {
    crearJugador({
      nombre: evento.target.elements.nombre.value,
      edad: evento.target.elements.edad.value,
      salario: evento.target.elements.salario.value,
    });
  }

  if (evento.target.matches("#editar-jugador")) {
    contenedorAsideEditar.classList.add("oculto");
    editarJugador({
      id_jugador: evento.target.dataset.id,
      nombre: evento.target.elements.nombre.value,
      edad: evento.target.elements.edad.value,
      salario: evento.target.elements.salario.value,
    });
  }
});

// Evento click
document.addEventListener("click", (evento) => {
  if (evento.target.matches("#eliminar")) {
    const id = evento.target.parentElement.id;
    eliminarJugador(id);
  }

  if (evento.target.matches("#editar")) {
    // Mostrar el formulario de editar
    contenedorAsideEditar.classList.remove("oculto");
    // Obtener el id del jugador
    const id = evento.target.parentElement.id;
    // Recuperar el jugador del DOM
    const jugadorHTML = document.getElementById(id);
    // Comprobar si el jugador existe en el DOM
    if (jugadorHTML) {
      jugadorEditando = {
        id_jugador: id,
        nombre: jugadorHTML.dataset.nombre,
        edad: jugadorHTML.dataset.edad,
        salario: jugadorHTML.dataset.salario,
      };
    } else {
      jugadorEditando = null;
    }

    if (jugadorEditando) {
      cargarDatosEnFormulario(jugadorEditando);
    } else {
      alerta("No se pudo cargar los datos del jugador");
    }
  }

  if (evento.target.matches("#cancelar-editar")) {
    contenedorAsideEditar.classList.add("oculto");
  }
});
