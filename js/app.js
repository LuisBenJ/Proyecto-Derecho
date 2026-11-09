/* =========================================================
   APLICACIÓN
   Navegación, buscador y renderizado de las unidades.
   ========================================================= */

const app = document.getElementById("app");
const TITULO_BASE = "Derecho y Legislación en Informática";
const PATRON_UNIDAD = /^u(\d+)(?:-(\d+))?$/;

function esc(valor) {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function unidadPorNumero(numero) {
  return UNIDADES.find((unidad) => unidad.n === Number(numero));
}

function ir(hash) {
  location.hash = hash;
}

function setTitulo(texto) {
  document.title = texto ? `${texto} · ${TITULO_BASE}` : TITULO_BASE;
}

function resaltar(texto, termino) {
  if (!termino) return esc(texto);

  const indice = texto.toLowerCase().indexOf(termino.toLowerCase());
  if (indice === -1) return esc(texto);

  const fin = indice + termino.length;

  return (
    esc(texto.slice(0, indice)) +
    `<mark>${esc(texto.slice(indice, fin))}</mark>` +
    esc(texto.slice(fin))
  );
}

function contenidoBuscable(unidad) {
  return [
    unidad.t,
    unidad.d,
    unidad.main_title,
    ...unidad.main,
    ...unidad.keys.flat(),
    ...unidad.s.flat()
  ].join(" ").toLowerCase();
}

function enfocarTitulo() {
  const titulo = app.querySelector("h1");
  if (titulo) {
    titulo.setAttribute("tabindex", "-1");
    titulo.focus({ preventScroll: true });
  }
}

function mostrarInicio() {
  setTitulo("");

  app.innerHTML = `
    <section class="hero">
      <svg class="hero-decoration" viewBox="0 0 1000 700" aria-hidden="true">
        <g fill="none" stroke="#9cc5ff" stroke-width="2" opacity=".35">
          <path d="M0 120h190l45 45h160M0 350h140l60-60h240M1000 170H790l-50 50H570M1000 470H820l-70-70H570M0 610h230l55-55h170"></path>
          <circle cx="235" cy="165" r="7"></circle>
          <circle cx="400" cy="165" r="7"></circle>
          <circle cx="500" cy="290" r="7"></circle>
          <circle cx="570" cy="400" r="7"></circle>
        </g>
        <g transform="translate(500 350)" fill="none" stroke="#dbeaff" stroke-width="5" opacity=".55">
          <path d="M0-130v230M-70 100h140M-120-65h240M-120-65l-42 78h84zM120-65l-42 78h84z"></path>
        </g>
      </svg>

      <div class="hero-content">
        <div class="hero-kicker">Material interactivo · México</div>
        <h1>Derecho y Legislación en Informática</h1>
        <p class="hero-subtitle">
          Explora las siete unidades con explicaciones del tema principal,
          conceptos clave, subtemas e información jurídica relacionada.
        </p>
        <a class="btn" href="#temas">Ver unidades</a>
      </div>
    </section>
  `;

  window.scrollTo(0, 0);
}

function mostrarLista(filtro = "") {
  setTitulo("Temas");

  app.innerHTML = `
    <div class="top">
      <a class="back" href="#">← Inicio</a>

      <input
        id="buscador"
        class="search"
        type="search"
        placeholder="Buscar una unidad o concepto..."
        aria-label="Buscar una unidad o concepto"
        value="${esc(filtro)}"
      >
    </div>

    <div class="wrap">
      <header class="unit-header">
        <div class="tag">Contenido de la materia</div>
        <h1 class="page-title">Temas de interés</h1>
        <p class="lead">
          Selecciona una unidad para estudiar primero la idea principal y
          después sus subtemas.
        </p>
      </header>

      <p class="result-count" id="result-count" aria-live="polite"></p>

      <div class="grid" id="grid"></div>
    </div>
  `;

  const buscador = document.getElementById("buscador");
  const grid = document.getElementById("grid");
  const contador = document.getElementById("result-count");

  function renderResultados(valor) {
    const termino = valor.trim().toLowerCase();
    const resultados = UNIDADES.filter((unidad) =>
      contenidoBuscable(unidad).includes(termino)
    );

    contador.textContent =
      resultados.length === 1
        ? "1 unidad encontrada"
        : `${resultados.length} unidades encontradas`;

    grid.innerHTML = resultados.length
      ? resultados.map((unidad) => `
          <a class="card" href="#u${unidad.n}">
            <img src="${esc(unidad.image)}" alt="Ilustración de ${esc(unidad.t)}" loading="lazy">
            <div class="card-body">
              <h2>Unidad ${unidad.n}. ${resaltar(unidad.t, termino)}</h2>
              <small>${resaltar(unidad.h, termino)}</small>
            </div>
          </a>
        `).join("")
      : `<p class="empty">No se encontraron coincidencias.</p>`;
  }

  renderResultados(filtro);

  let temporizador;
  buscador.addEventListener("input", (event) => {
    const valor = event.target.value;
    clearTimeout(temporizador);
    temporizador = setTimeout(() => renderResultados(valor), 140);
  });

  window.scrollTo(0, 0);
}

function mostrarUnidad(numero) {
  const unidad = unidadPorNumero(numero);

  if (!unidad) {
    mostrarInicio();
    return;
  }

  setTitulo(`Unidad ${unidad.n}. ${unidad.t}`);

  app.innerHTML = `
    <div class="top">
      <a class="back" href="#temas">← Temas</a>
      <span class="crumb">Unidad ${unidad.n}</span>
    </div>

    <div class="wrap">
      <header class="unit-header">
        <div class="tag">Unidad ${unidad.n} · ${esc(unidad.h)}</div>
        <h1 class="page-title">${esc(unidad.t)}</h1>
        <p class="lead">${esc(unidad.d)}</p>
      </header>

      <div class="hero-image">
        <img src="${esc(unidad.image)}" alt="Ilustración relacionada con ${esc(unidad.t)}">
      </div>

      <section class="info-section">
        <h2>${esc(unidad.main_title)}</h2>
        ${unidad.main.map((parrafo) => `<p>${esc(parrafo)}</p>`).join("")}

        <div class="key-grid">
          ${unidad.keys.map(([nombre, texto]) => `
            <article class="key-card">
              <strong>${esc(nombre)}</strong>
              <span>${esc(texto)}</span>
            </article>
          `).join("")}
        </div>
      </section>

      <h2 class="section-title">Subtemas</h2>

      <div class="subs">
        ${unidad.s.map(([titulo], index) => `
          <a class="sub" href="#u${unidad.n}-${index + 1}">
            <b>${unidad.n}.${index + 1}</b>
            <span>${esc(titulo)}</span>
          </a>
        `).join("")}
      </div>

      <section class="sources">
        <h2>Fuentes de consulta</h2>
        ${unidad.sources.map(([nombre, url]) => `
          <a href="${esc(url)}" target="_blank" rel="noopener noreferrer">
            ${esc(nombre)}
          </a>
        `).join("")}
      </section>
    </div>
  `;

  window.scrollTo(0, 0);
}

function mostrarSubtema(numero, indice) {
  const unidad = unidadPorNumero(numero);
  const subtema = unidad?.s?.[indice - 1];

  if (!unidad || !subtema) {
    mostrarUnidad(numero);
    return;
  }

  const [titulo, descripcion] = subtema;
  const anterior = indice > 1;
  const siguiente = indice < unidad.s.length;

  setTitulo(`${unidad.n}.${indice} ${titulo}`);

  app.innerHTML = `
    <div class="top">
      <a class="back" href="#u${unidad.n}">← Unidad ${unidad.n}</a>
      <span class="crumb">${unidad.n}.${indice} ${esc(titulo)}</span>
    </div>

    <div class="wrap">
      <div class="tag">Unidad ${unidad.n} · ${esc(unidad.t)}</div>
      <h1 class="page-title">${unidad.n}.${indice} ${esc(titulo)}</h1>

      <div class="hero-image">
        <img src="${esc(unidad.image)}" alt="Ilustración de ${esc(unidad.t)}">
      </div>

      <section class="info-section topic-box">
        <h2>¿De qué trata?</h2>
        <p class="topic-description">${esc(descripcion)}</p>
      </section>

      <nav class="nav" aria-label="Navegación entre subtemas">
        ${
          anterior
            ? `<a class="back" href="#u${unidad.n}-${indice - 1}">← Anterior</a>`
            : `<span></span>`
        }

        ${
          siguiente
            ? `<a class="back" href="#u${unidad.n}-${indice + 1}">Siguiente →</a>`
            : `<span></span>`
        }
      </nav>
    </div>
  `;

  window.scrollTo(0, 0);
}

let primeraCarga = true;

function manejarRuta() {
  const hash = location.hash.slice(1);

  if (hash === "app") {
    app.focus({ preventScroll: true });
    return;
  }

  if (hash === "temas") {
    mostrarLista();
  } else {
    const match = hash.match(PATRON_UNIDAD);

    if (!match) {
      mostrarInicio();
    } else {
      const numero = Number(match[1]);
      const indice = match[2] ? Number(match[2]) : null;

      if (indice) {
        mostrarSubtema(numero, indice);
      } else {
        mostrarUnidad(numero);
      }
    }
  }

  if (!primeraCarga) {
    enfocarTitulo();
  }

  primeraCarga = false;
}

function iniciar() {
  if (typeof UNIDADES === "undefined" || !Array.isArray(UNIDADES) || !UNIDADES.length) {
    app.innerHTML = `
      <div class="wrap">
        <p class="empty">
          No se pudo cargar el contenido. Verifica que <code>js/data.js</code>
          esté disponible.
        </p>
      </div>
    `;
    return;
  }

  window.addEventListener("hashchange", manejarRuta);
  manejarRuta();
}

iniciar();
