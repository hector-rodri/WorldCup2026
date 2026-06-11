var idiomaActual = "es";

function t(clave) {
  return traducciones[idiomaActual][clave] || clave;
}

function cambiarIdioma(idioma) {
  idiomaActual = idioma;

  var elementos = document.querySelectorAll("[data-i18n]");
  for (var i = 0; i < elementos.length; i++) {
    var key = elementos[i].getAttribute("data-i18n");
    if (traducciones[idioma][key]) {
      elementos[i].textContent = traducciones[idioma][key];
    }
  }

  var placeholders = document.querySelectorAll("[data-i18n-placeholder]");
  for (var i = 0; i < placeholders.length; i++) {
    var key = placeholders[i].getAttribute("data-i18n-placeholder");
    if (traducciones[idioma][key]) {
      placeholders[i].placeholder = traducciones[idioma][key];
    }
  }

  var grupoOpts = document.querySelectorAll("[data-grupo]");
  for (var i = 0; i < grupoOpts.length; i++) {
    grupoOpts[i].textContent = t("grupo") + " " + grupoOpts[i].getAttribute("data-grupo");
  }

  document.title = t("titulo");
  document.documentElement.lang = idioma;

  document.getElementById("btnEs").classList.remove("activo");
  document.getElementById("btnCa").classList.remove("activo");
  document.getElementById("btnEn").classList.remove("activo");
  document.getElementById("btn" + idioma.charAt(0).toUpperCase() + idioma.slice(1)).classList.add("activo");

  if (partidos.length > 0) {
    aplicarFiltros();
  }
  if (equiposCargados) {
    aplicarFiltrosEquipos();
  }
}

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
      "<div class='info'>" + p.date + " " + t("aLas") + " " + p.time + "</div>" +
      "<div class='info'>" + t("estadio") + ": " + p.ground + "</div>" +
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
    opt.setAttribute("data-grupo", grupos[i]);
    opt.textContent = t("grupo") + " " + grupos[i];
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
      "<div class='info'>" + t("grupo") + " " + e.group + " - " + e.confed + "</div>" +
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

var botonJugadores = document.getElementById("btnBuscarJugadores");
var pais = document.getElementById("pais");

botonJugadores.addEventListener("click", function() {
  var nombre = pais.value.trim();
  if (nombre == "") {
    return;
  }
  document.getElementById("jugadores").innerHTML = t("buscando");
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
        document.getElementById("jugadores").innerHTML = t("noEncontradoPais");
        return;
      }

      var equiposSoccer = [];
      for (var i = 0; i < datos.teams.length; i++) {
        if (datos.teams[i].strSport == "Soccer") {
          equiposSoccer.push(datos.teams[i]);
        }
      }

      var equipo = null;

      // 1. Coincidencia exacta de nombre
      for (var i = 0; i < equiposSoccer.length; i++) {
        if (equiposSoccer[i].strTeam.toLowerCase() == nombre.toLowerCase()) {
          equipo = equiposSoccer[i];
          break;
        }
      }

      // 2. Liga internacional (selección nacional)
      if (equipo == null) {
        for (var i = 0; i < equiposSoccer.length; i++) {
          var liga = equiposSoccer[i].strLeague || "";
          if (liga.toLowerCase().indexOf("international") != -1) {
            equipo = equiposSoccer[i];
            break;
          }
        }
      }

      // 3. Fallback al primero de Soccer
      if (equipo == null && equiposSoccer.length > 0) {
        equipo = equiposSoccer[0];
      }

      if (equipo == null) {
        document.getElementById("jugadores").innerHTML = t("noEncontradoSeleccion");
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
        document.getElementById("jugadores").innerHTML = t("noJugadores") + " " + nombre + ".";
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
        html += "<div class='info'>" + (j.strPosition || t("sinPosicion")) + "</div>";
        html += "</div>";
      }
      document.getElementById("jugadores").innerHTML = html;
    });
}
