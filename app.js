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
    filtrarEstadios();
    mostrar(partidos);
  });

function filtrarEstadios() {
  var select = document.getElementById("filtroEstadio");
  var estadios = [];
  for (var i = 0; i < partidos.length; i++) {
    if (estadios.indexOf(partidos[i].ground) == -1) {
      estadios.push(partidos[i].ground);
    }
  }
  estadios.sort();
  for (var i = 0; i < estadios.length; i++) {
    var opt = document.createElement("option");
    opt.value = estadios[i];
    opt.textContent = estadios[i];
    select.appendChild(opt);
  }
}

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

var buscar = document.getElementById("buscarPartido");

buscar.addEventListener("keyup", aplicarFiltros);

var btnFiltrar = document.getElementById("btnFiltrar");
var panelFiltros = document.getElementById("panelFiltros");

btnFiltrar.addEventListener("click", function() {
  var visible = panelFiltros.style.display == "block";
  panelFiltros.style.display = visible ? "none" : "block";
});

document.getElementById("filtroFecha").addEventListener("change", aplicarFiltros);
document.getElementById("filtroEstadio").addEventListener("change", aplicarFiltros);

document.getElementById("btnLimpiarFiltros").addEventListener("click", function() {
  document.getElementById("filtroFecha").value = "";
  document.getElementById("filtroEstadio").value = "";
  buscar.value = "";
  mostrar(partidos);
});

function aplicarFiltros() {
  var texto = buscar.value.toLowerCase();
  var fecha = document.getElementById("filtroFecha").value;
  var estadio = document.getElementById("filtroEstadio").value;
  var resultado = [];

  for (var i = 0; i < partidos.length; i++) {
    var p = partidos[i];
    var coincideTexto = p.team1.toLowerCase().indexOf(texto) != -1 || p.team2.toLowerCase().indexOf(texto) != -1;
    var coincideFecha = fecha == "" || p.date == fecha;
    var coincideEstadio = estadio == "" || p.ground == estadio;
    if (coincideTexto && coincideFecha && coincideEstadio) {
      resultado.push(p);
    }
  }

  mostrar(resultado);
}


var equiposCargados = false;
var equiposData = [];

function cargarEquipos() {
  if (equiposCargados == true) {
    return;
  }

  fetch("https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.teams.json")
    .then(function(respuesta) {
      return respuesta.json();
    })
    .then(function(equipos) {
      equiposData = equipos;
      poblarFiltrosEquipos();
      mostrarEquipos(equiposData);
      equiposCargados = true;
    });
}

function poblarFiltrosEquipos() {
  var selectPais = document.getElementById("filtroPais");
  var selectGrupo = document.getElementById("filtroGrupo");
  var grupos = [];

  for (var i = 0; i < equiposData.length; i++) {
    var e = equiposData[i];

    var optPais = document.createElement("option");
    optPais.value = e.name;
    optPais.textContent = e.flag_icon + " " + e.name;
    selectPais.appendChild(optPais);

    if (grupos.indexOf(e.group) == -1) {
      grupos.push(e.group);
    }
  }

  grupos.sort();
  for (var i = 0; i < grupos.length; i++) {
    var opt = document.createElement("option");
    opt.value = grupos[i];
    opt.textContent = "Grupo " + grupos[i];
    selectGrupo.appendChild(opt);
  }
}

function mostrarEquipos(lista) {
  var div = document.getElementById("equipos");
  div.innerHTML = "";
  for (var i = 0; i < lista.length; i++) {
    var e = lista[i];
    div.innerHTML += "<div class='partido'>" +
      "<div class='equipos'>" + e.flag_icon + " " + e.name + "</div>" +
      "<div class='info'>Grupo " + e.group + " - " + e.confed + "</div>" +
      "</div>";
  }
}

function aplicarFiltrosEquipos() {
  var paiSel = document.getElementById("filtroPais").value;
  var grupoSel = document.getElementById("filtroGrupo").value;
  var resultado = [];

  for (var i = 0; i < equiposData.length; i++) {
    var e = equiposData[i];
    var coincidePais = paiSel == "" || e.name == paiSel;
    var coincideGrupo = grupoSel == "" || e.group == grupoSel;
    if (coincidePais && coincideGrupo) {
      resultado.push(e);
    }
  }

  mostrarEquipos(resultado);
}

var btnFiltrarEquipos = document.getElementById("btnFiltrarEquipos");
var panelFiltrosEquipos = document.getElementById("panelFiltrosEquipos");

btnFiltrarEquipos.addEventListener("click", function() {
  var visible = panelFiltrosEquipos.style.display == "block";
  panelFiltrosEquipos.style.display = visible ? "none" : "block";
});

document.getElementById("filtroPais").addEventListener("change", aplicarFiltrosEquipos);
document.getElementById("filtroGrupo").addEventListener("change", aplicarFiltrosEquipos);

document.getElementById("btnLimpiarFiltrosEquipos").addEventListener("click", function() {
  document.getElementById("filtroPais").value = "";
  document.getElementById("filtroGrupo").value = "";
  mostrarEquipos(equiposData);
});


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
