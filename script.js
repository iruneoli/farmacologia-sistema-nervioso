let datos = null;
let preguntaActual = null;
let actividad2Correctos = [];

fetch("data/farmacologia.json")
  .then(response => response.json())
  .then(data => {
    datos = data;
    console.log("JSON cargado correctamente");
    console.log(datos);
  })
  .catch(error => {
    console.error("Error cargando el JSON:", error);
  });

function mezclarArray(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/* =========================
   ACTIVIDAD 1
========================= */

function actividad1() {
  const contenedor = document.getElementById("contenido");

  if (!datos || !datos.subgrupos || datos.subgrupos.length === 0) {
    contenedor.innerHTML =
      "<h2>Actividad 1: Definiciones de subgrupos</h2><p>Cargando datos...</p>";
    return;
  }

  generarPreguntaActividad1();
}

function generarPreguntaActividad1() {
  const contenedor = document.getElementById("contenido");
  const subgrupos = datos.subgrupos;

  const correcta = subgrupos[Math.floor(Math.random() * subgrupos.length)];
  preguntaActual = correcta.nombre;

  const incorrectas = subgrupos
    .filter(s => s.nombre !== correcta.nombre)
    .map(s => s.nombre);

  const opciones = mezclarArray([
    correcta.nombre,
    ...mezclarArray(incorrectas).slice(0, 3)
  ]);

  let botonesHTML = "";

  opciones.forEach(opcion => {
    botonesHTML += `
      <button class="opcion-btn" onclick="comprobarActividad1(this)" data-opcion="${opcion}">
        ${opcion}
      </button>
    `;
  });

  contenedor.innerHTML = `
    <h2>Actividad 1: Definiciones de subgrupos</h2>
    <div class="caja-actividad">
      <p><strong>Definición:</strong></p>
      <p class="definicion">${correcta.definicion || "Sin definición"}</p>
      <div class="opciones-grid">
        ${botonesHTML}
      </div>
      <p id="resultado"></p>
      <button class="siguiente-btn" onclick="generarPreguntaActividad1()">Siguiente pregunta</button>
    </div>
  `;
}

function comprobarActividad1(boton) {
  const respuesta = boton.dataset.opcion;
  const resultado = document.getElementById("resultado");

  if (respuesta === preguntaActual) {
    resultado.innerHTML = "✅ Correcto";
    resultado.style.color = "green";
  } else {
    resultado.innerHTML = `❌ Incorrecto. La respuesta correcta es: <strong>${preguntaActual}</strong>`;
    resultado.style.color = "red";
  }
}

/* =========================
   ACTIVIDAD 2
========================= */

function actividad2() {
  const contenedor = document.getElementById("contenido");

  if (!datos || !datos.subgrupos || datos.subgrupos.length === 0) {
    contenedor.innerHTML =
      "<h2>Actividad 2: Clasificar principios activos</h2><p>Cargando datos...</p>";
    return;
  }

  generarPreguntaActividad2();
}

function generarPreguntaActividad2() {
  const contenedor = document.getElementById("contenido");
  const subgrupos = datos.subgrupos;

  const subgrupoElegido =
    subgrupos[Math.floor(Math.random() * subgrupos.length)];

  const correctos = obtenerPrincipiosActivosDeSubgrupo(subgrupoElegido);
  actividad2Correctos = [...correctos];

  const todosLosFarmacos = obtenerTodosLosPrincipiosActivos();
  const incorrectos = todosLosFarmacos.filter(f => !correctos.includes(f));

  const cantidadIncorrectos = Math.min(8, incorrectos.length);
  const incorrectosMezclados = mezclarArray(incorrectos).slice(0, cantidadIncorrectos);

  const opcionesFinales = mezclarArray([...correctos, ...incorrectosMezclados]);

  let checkboxesHTML = "";

  opcionesFinales.forEach((farmaco, index) => {
    checkboxesHTML += `
      <label class="checkbox-opcion" for="farmaco_${index}">
        <input type="checkbox" value="${farmaco}" id="farmaco_${index}">
        ${farmaco}
      </label>
    `;
  });

  contenedor.innerHTML = `
    <h2>Actividad 2: Clasificar principios activos</h2>
    <div class="caja-actividad">
      <p><strong>Subgrupo terapéutico:</strong></p>
      <p class="definicion">${subgrupoElegido.nombre}</p>
      <p>Marca todos los principios activos que pertenezcan a este subgrupo:</p>

      <div class="checkbox-grid">
        ${checkboxesHTML}
      </div>

      <p id="resultado2"></p>

      <button class="siguiente-btn" onclick="comprobarActividad2()">Comprobar</button>
      <button class="siguiente-btn" onclick="generarPreguntaActividad2()">Siguiente pregunta</button>
    </div>
  `;
}

function obtenerPrincipiosActivosDeSubgrupo(subgrupo) {
  const lista = [];

  if (!subgrupo.grupos_quimicos) {
    return lista;
  }

  subgrupo.grupos_quimicos.forEach(grupo => {
    if (grupo.farmacos) {
      grupo.farmacos.forEach(farmaco => {
        if (farmaco.principio_activo) {
          lista.push(farmaco.principio_activo);
        }
      });
    }
  });

  return [...new Set(lista)];
}

function obtenerTodosLosPrincipiosActivos() {
  const todos = [];

  datos.subgrupos.forEach(subgrupo => {
    if (subgrupo.grupos_quimicos) {
      subgrupo.grupos_quimicos.forEach(grupo => {
        if (grupo.farmacos) {
          grupo.farmacos.forEach(farmaco => {
            if (farmaco.principio_activo) {
              todos.push(farmaco.principio_activo);
            }
          });
        }
      });
    }
  });

  return [...new Set(todos)];
}

function comprobarActividad2() {
  const checkboxes = document.querySelectorAll('.checkbox-grid input[type="checkbox"]');
  const seleccionados = [];

  checkboxes.forEach(cb => {
    if (cb.checked) {
      seleccionados.push(cb.value);
    }
  });

  const resultado = document.getElementById("resultado2");

  const faltan = actividad2Correctos.filter(f => !seleccionados.includes(f));
  const sobran = seleccionados.filter(f => !actividad2Correctos.includes(f));

  if (faltan.length === 0 && sobran.length === 0) {
    resultado.innerHTML = "✅ Correcto";
    resultado.style.color = "green";
    return;
  }

  let mensaje = "❌ Incorrecto.<br>";

  if (faltan.length > 0) {
    mensaje += `<strong>Te faltó marcar:</strong> ${faltan.join(", ")}<br>`;
  }

  if (sobran.length > 0) {
    mensaje += `<strong>Marcaste mal:</strong> ${sobran.join(", ")}<br>`;
  }

  mensaje += `<strong>Respuesta correcta:</strong> ${actividad2Correctos.join(", ")}`;

  resultado.innerHTML = mensaje;
  resultado.style.color = "red";
}

/* =========================
   ACTIVIDAD 3, 4 y 5
========================= */

function actividad3() {
  document.getElementById("contenido").innerHTML =
    "<h2>Actividad 3: Subgrupo / efectos adversos</h2>";
}

function actividad4() {
  document.getElementById("contenido").innerHTML =
    "<h2>Actividad 4: EF ↔ principio activo</h2>";
}

function actividad5() {
  document.getElementById("contenido").innerHTML =
    "<h2>Actividad 5: Tipo test</h2>";
}
