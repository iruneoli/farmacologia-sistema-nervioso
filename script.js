let datos = null;
let preguntaActual = null;

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
  return [...array].sort(() => Math.random() - 0.5);
}

function actividad1() {
  if (!datos || !datos.subgrupos || datos.subgrupos.length === 0) {
    document.getElementById("contenido").innerHTML =
      "<h2>Actividad 1: Definiciones de subgrupos</h2><p>Cargando datos...</p>";
    return;
  }

  generarPreguntaActividad1();
}

function generarPreguntaActividad1() {
  const subgrupos = datos.subgrupos;

  // Elegir subgrupo correcto al azar
  const correcta = subgrupos[Math.floor(Math.random() * subgrupos.length)];

  // Guardar pregunta actual
  preguntaActual = correcta.nombre;

  // Sacar 3 opciones incorrectas distintas
  const incorrectas = subgrupos
    .filter(s => s.nombre !== correcta.nombre)
    .map(s => s.nombre);

  const incorrectasMezcladas = mezclarArray(incorrectas).slice(0, 3);

  // Mezclar opciones finales
  const opciones = mezclarArray([
    correcta.nombre,
    ...incorrectasMezcladas
  ]);

  // Crear botones
  let botonesHTML = "";
  opciones.forEach(opcion => {
    botonesHTML += `
      <button class="opcion-btn" onclick="comprobarActividad1('${opcion.replace(/'/g, "\\'")}')">
        ${opcion}
      </button>
    `;
  });

  document.getElementById("contenido").innerHTML = `
    <h2>Actividad 1: Definiciones de subgrupos</h2>
    <div class="caja-actividad">
      <p><strong>Definición:</strong></p>
      <p class="definicion">${correcta.definicion}</p>
      <div class="opciones-grid">
        ${botonesHTML}
      </div>
      <p id="resultado"></p>
      <button class="siguiente-btn" onclick="generarPreguntaActividad1()">Siguiente pregunta</button>
    </div>
  `;
}

function comprobarActividad1(respuesta) {
  const resultado = document.getElementById("resultado");

  if (respuesta === preguntaActual) {
    resultado.innerHTML = "✅ Correcto";
    resultado.style.color = "green";
  } else {
    resultado.innerHTML = `❌ Incorrecto. La respuesta correcta es: <strong>${preguntaActual}</strong>`;
    resultado.style.color = "red";
  }
}

function actividad2() {
  document.getElementById("contenido").innerHTML =
    "<h2>Actividad 2: Clasificar principios activos</h2>";
}

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
