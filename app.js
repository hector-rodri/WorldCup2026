function verSeccion(nombre) {
  document.getElementById("seccionPartidos").style.display = "none";
  document.getElementById("seccionJugadores").style.display = "none";
  document.getElementById("seccionEquipos").style.display = "none";

  if (nombre == "partidos") {
    document.getElementById("seccionPartidos").style.display = "block";
  }
  if (nombre == "jugadores") {
    document.getElementById("seccionJugadores").style.display = "block";
  }
  if (nombre == "equipos") {
    document.getElementById("seccionEquipos").style.display = "block";
    cargarEquipos();
  }
}

verSeccion("partidos");


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


var equiposCargados = false;

function cargarEquipos() {
  if (equiposCargados == true) {
    return;
  }

  fetch("https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.teams.json")
    .then(function(respuesta) {
      return respuesta.json();
    })
    .then(function(equipos) {
      var div = document.getElementById("equipos");
      div.innerHTML = "";

      for (var i = 0; i < equipos.length; i++) {
        var e = equipos[i];
        div.innerHTML += "<div class='partido'>" +
          "<div class='equipos'>" + e.flag_icon + " " + e.name + "</div>" +
          "<div class='info'>Grupo " + e.group + " - " + e.confed + "</div>" +
          "</div>";
      }

      equiposCargados = true;
    });
}


var clave = "123";

var botonJugadores = document.getElementById("btnJugadores");
var pais = document.getElementById("pais");

botonJugadores.addEventListener("click", function() {
  var nombre = pais.value.trim();
  if (nombre == "") {
    return;
  }
  document.getElementById("jugadores").innerHTML = "Buscando...";
  buscarEquipo(nombre);
});

function buscarEquipo(nombre) {
  var url = "https://www.thesportsdb.com/api/v1/json/" + clave + "/searchteams.php?t=" + nombre;

  fetch(url)
    .then(function(respuesta) {
      return respuesta.json();
    })
    .then(function(datos) {
      if (datos.teams == null) {
        document.getElementById("jugadores").innerHTML = "No se ha encontrado ese pais.";
        return;
      }

      var equipo = null;
      for (var i = 0; i < datos.teams.length; i++) {
        if (datos.teams[i].strSport == "Soccer") {
          equipo = datos.teams[i];
          break;
        }
      }

      if (equipo == null) {
        document.getElementById("jugadores").innerHTML = "No se ha encontrado una seleccion.";
        return;
      }

      buscarJugadores(equipo.idTeam, equipo.strTeam);
    });
}

function buscarJugadores(id, nombre) {
  var url = "https://www.thesportsdb.com/api/v1/json/" + clave + "/lookup_all_players.php?id=" + id;

  fetch(url)
    .then(function(respuesta) {
      return respuesta.json();
    })
    .then(function(datos) {
      var jugadores = datos.player;

      if (jugadores == null) {
        document.getElementById("jugadores").innerHTML = "No hay jugadores para " + nombre + ".";
        return;
      }

      var html = "<h2>" + nombre + "</h2>";
      for (var i = 0; i < jugadores.length; i++) {
        var j = jugadores[i];
        html += "<div class='partido'>";
        if (j.strThumb != null && j.strThumb != "") {
          html += "<img src='" + j.strThumb + "/preview' width='50'> ";
        }
        html += "<div class='equipos'>" + j.strPlayer + "</div>";
        html += "<div class='info'>" + (j.strPosition || "Sin posicion") + "</div>";
        html += "</div>";
      }
      document.getElementById("jugadores").innerHTML = html;
    });
}
