document.addEventListener("DOMContentLoaded",() => {
  fetch('http://localhost:3000/jugadores')
  .then((res) => res.json())
  .then((jugadores) => {
    jugadores.forEach(element => {
      const listaJug = document.querySelector("#fetch-prueba");
      const texto = element.jugador_link;
      let elemento = document.createElement("p");
      elemento.textContent = texto;

      listaJug.append(elemento);
    });
  });

  document.addEventListener("submit", (e) => {
    e.preventDefault();
    
  })
});