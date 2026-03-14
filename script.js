let datos = null;

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

function actividad1() {
  document.getElementById("contenido").innerHTML =
    "<h2>Actividad 1: Definiciones de subgrupos</h2>";
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
