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
  if (!datos || !datos.subgrupos || datos.subgrupos.length === 0) {
    document.getElementById("contenido").innerHTML =
      "<h2>Actividad 3: Relaciones farmacológicas</h2><p>Cargando datos...</p>";
    return;
  }

  generarPreguntaActividad3();
}

function generarPreguntaActividad3() {
  const contenedor = document.getElementById("contenido");

  const registros = construirRegistrosActividad3();

  if (registros.length === 0) {
    contenedor.innerHTML = `
      <h2>Actividad 3: Relaciones farmacológicas</h2>
      <p>No hay datos suficientes.</p>
    `;
    return;
  }

  const tipos = [
    "PA_EFECTO",
    "PA_GRUPO",
    "PA_SUBGRUPO",
    "EFECTO_SUBGRUPO",
    "GRUPO_EFECTO"
  ];

  const tipo = tipos[Math.floor(Math.random() * tipos.length)];
  const registro = registros[Math.floor(Math.random() * registros.length)];

  let pregunta = "";
  let correcta = "";
  let opciones = [];

  if (tipo === "PA_EFECTO") {
    pregunta = `¿Qué efecto adverso puede tener ${registro.principio_activo}?`;
    correcta = unirEfectos(registro.efectos_adversos);

    const distractores = mezclarArray(
      [...new Set(
        registros
          .map(r => unirEfectos(r.efectos_adversos))
          .filter(e => e && e !== correcta)
      )]
    ).slice(0, 3);

    opciones = mezclarArray([correcta, ...distractores]);
  }

  if (tipo === "PA_GRUPO") {
    pregunta = `¿A qué grupo químico pertenece ${registro.principio_activo}?`;
    correcta = registro.grupo_quimico;

    const distractores = mezclarArray(
      [...new Set(
        registros
          .map(r => r.grupo_quimico)
          .filter(g => g && g !== correcta)
      )]
    ).slice(0, 3);

    opciones = mezclarArray([correcta, ...distractores]);
  }

  if (tipo === "PA_SUBGRUPO") {
    pregunta = `¿A qué subgrupo terapéutico pertenece ${registro.principio_activo}?`;
    correcta = registro.subgrupo;

    const distractores = mezclarArray(
      [...new Set(
        registros
          .map(r => r.subgrupo)
          .filter(s => s && s !== correcta)
      )]
    ).slice(0, 3);

    opciones = mezclarArray([correcta, ...distractores]);
  }

  if (tipo === "EFECTO_SUBGRUPO") {
    const conEfectos = registros.filter(r => r.efectos_adversos && r.efectos_adversos.length > 0);
    const elegido = conEfectos[Math.floor(Math.random() * conEfectos.length)];

    pregunta = `¿Qué subgrupo terapéutico se asocia con estos efectos adversos?<br><strong>${unirEfectos(elegido.efectos_adversos)}</strong>`;
    correcta = elegido.subgrupo;

    const distractores = mezclarArray(
      [...new Set(
        registros
          .map(r => r.subgrupo)
          .filter(s => s && s !== correcta)
      )]
    ).slice(0, 3);

    opciones = mezclarArray([correcta, ...distractores]);
  }

  if (tipo === "GRUPO_EFECTO") {
    const conEfectos = registros.filter(r => r.efectos_adversos && r.efectos_adversos.length > 0);
    const elegido = conEfectos[Math.floor(Math.random() * conEfectos.length)];

    pregunta = `¿Qué efecto adverso se asocia al grupo químico ${elegido.grupo_quimico}?`;
    correcta = unirEfectos(elegido.efectos_adversos);

    const distractores = mezclarArray(
      [...new Set(
        registros
          .map(r => unirEfectos(r.efectos_adversos))
          .filter(e => e && e !== correcta)
      )]
    ).slice(0, 3);

    opciones = mezclarArray([correcta, ...distractores]);
  }

  let botonesHTML = "";
  opciones.forEach(opcion => {
    const opcionSegura = opcion.replace(/"/g, '&quot;');
    botonesHTML += `
      <button class="opcion-btn" onclick="comprobarActividad3(this)" data-correcta="${correcta.replace(/"/g, '&quot;')}" data-opcion="${opcionSegura}">
        ${opcion}
      </button>
    `;
  });

  contenedor.innerHTML = `
    <h2>Actividad 3: Relaciones farmacológicas</h2>
    <div class="caja-actividad">
      <p class="definicion">${pregunta}</p>
      <div class="opciones-grid">
        ${botonesHTML}
      </div>
      <p id="resultado3"></p>
      <button class="siguiente-btn" onclick="generarPreguntaActividad3()">Siguiente pregunta</button>
    </div>
  `;
}

function comprobarActividad3(boton) {
  const opcion = boton.dataset.opcion;
  const correcta = boton.dataset.correcta;
  const resultado = document.getElementById("resultado3");

  if (opcion === correcta) {
    resultado.innerHTML = "✅ Correcto";
    resultado.style.color = "green";
  } else {
    resultado.innerHTML = `❌ Incorrecto. La respuesta correcta es:<br><strong>${correcta}</strong>`;
    resultado.style.color = "red";
  }
}

function construirRegistrosActividad3() {
  const registros = [];

  datos.subgrupos.forEach(subgrupo => {
    if (!subgrupo.grupos_quimicos) return;

    subgrupo.grupos_quimicos.forEach(grupo => {
      if (!grupo.farmacos) return;

      grupo.farmacos.forEach(farmaco => {
        registros.push({
          subgrupo: subgrupo.nombre || "",
          grupo_quimico: grupo.nombre || "",
          principio_activo: farmaco.principio_activo || "",
          ef: farmaco.ef || "",
          efectos_adversos: grupo.efectos_adversos || []
        });
      });
    });
  });

  return registros.filter(r => r.principio_activo);
}

function unirEfectos(lista) {
  if (!lista || lista.length === 0) return "Sin efectos adversos especificados";
  return lista.join(", ");
}

function actividad4() {
  if (!datos || !datos.subgrupos || datos.subgrupos.length === 0) {
    document.getElementById("contenido").innerHTML =
      "<h2>Actividad 4: EF ↔ principio activo</h2><p>Cargando datos...</p>";
    return;
  }

  generarPreguntaActividad4();
}

function generarPreguntaActividad4() {
  const contenedor = document.getElementById("contenido");
  const pares = construirParesEFPrincipio();

  if (pares.length < 4) {
    contenedor.innerHTML = `
      <h2>Actividad 4: EF ↔ principio activo</h2>
      <p>No hay suficientes datos con EF para generar preguntas.</p>
    `;
    return;
  }

  const modos = ["EF_A_PA", "PA_A_EF"];
  const modo = modos[Math.floor(Math.random() * modos.length)];

  const correcto = pares[Math.floor(Math.random() * pares.length)];

  let pregunta = "";
  let respuestaCorrecta = "";
  let opciones = [];

  if (modo === "EF_A_PA") {
    pregunta = `¿Cuál es el principio activo de <strong>${correcto.ef}</strong>?`;
    respuestaCorrecta = correcto.principio_activo;

    const distractores = mezclarArray(
      [...new Set(
        pares
          .map(p => p.principio_activo)
          .filter(p => p && p !== respuestaCorrecta)
      )]
    ).slice(0, 3);

    opciones = mezclarArray([respuestaCorrecta, ...distractores]);
  }

  if (modo === "PA_A_EF") {
    pregunta = `¿Cuál es la especialidad farmacéutica (EF) de <strong>${correcto.principio_activo}</strong>?`;
    respuestaCorrecta = correcto.ef;

    const distractores = mezclarArray(
      [...new Set(
        pares
          .map(p => p.ef)
          .filter(e => e && e !== respuestaCorrecta)
      )]
    ).slice(0, 3);

    opciones = mezclarArray([respuestaCorrecta, ...distractores]);
  }

  let botonesHTML = "";
  opciones.forEach(opcion => {
    const opcionSegura = opcion.replace(/"/g, '&quot;');
    const correctaSegura = respuestaCorrecta.replace(/"/g, '&quot;');

    botonesHTML += `
      <button class="opcion-btn" onclick="comprobarActividad4(this)" data-opcion="${opcionSegura}" data-correcta="${correctaSegura}">
        ${opcion}
      </button>
    `;
  });

  contenedor.innerHTML = `
    <h2>Actividad 4: EF ↔ principio activo</h2>
    <div class="caja-actividad">
      <p class="definicion">${pregunta}</p>
      <div class="opciones-grid">
        ${botonesHTML}
      </div>
      <p id="resultado4"></p>
      <button class="siguiente-btn" onclick="generarPreguntaActividad4()">Siguiente pregunta</button>
    </div>
  `;
}

function comprobarActividad4(boton) {
  const opcion = boton.dataset.opcion;
  const correcta = boton.dataset.correcta;
  const resultado = document.getElementById("resultado4");

  if (opcion === correcta) {
    resultado.innerHTML = "✅ Correcto";
    resultado.style.color = "green";
  } else {
    resultado.innerHTML = `❌ Incorrecto. La respuesta correcta es: <strong>${correcta}</strong>`;
    resultado.style.color = "red";
  }
}

function construirParesEFPrincipio() {
  const pares = [];

  datos.subgrupos.forEach(subgrupo => {
    if (!subgrupo.grupos_quimicos) return;

    subgrupo.grupos_quimicos.forEach(grupo => {
      if (!grupo.farmacos) return;

      grupo.farmacos.forEach(farmaco => {
        if (farmaco.principio_activo && farmaco.ef && farmaco.ef.trim() !== "") {
          pares.push({
            principio_activo: farmaco.principio_activo,
            ef: farmaco.ef
          });
        }
      });
    });
  });

  return pares;
}
function actividad5() {
  document.getElementById("contenido").innerHTML =
    "<h2>Actividad 5: Tipo test</h2>";
}
