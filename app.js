function verSeccion(nombre) {

}

var url = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

var partidos = [];

fetch(url)
  .then(function(respuesta) {
    return respuesta.json();
  })
  .then(function(datos) {
    partidos = datos.matches;
    mostrar(partidos);
  });

function mostrar(lista) {
  var div = document.getElementById("partidos");
  div.innerHTML = "";

  for (var i = 0; i < lista.length; i++) {
    var p = lista[i];
    div.innerHTML += "<div class='partido'>" +
      "<div class='equipos'>" + p.team1 + " - " + p.team2 + "</div>" +
      "<div class='info'>" + p.date + " a las " + p.time + "</div>" +
      "<div class='info'>Estadio: " + p.ground + "</div>" +
      "</div>";
  }
}

var buscar = document.getElementById("buscar");

buscar.addEventListener("keyup", function() {
  var texto = buscar.value.toLowerCase();
  var encontrados = [];

  for (var i = 0; i < partidos.length; i++) {
    var p = partidos[i];
    if (p.team1.toLowerCase().indexOf(texto) != -1 || p.team2.toLowerCase().indexOf(texto) != -1) {
      encontrados.push(p);
    }
  }

  mostrar(encontrados);
});