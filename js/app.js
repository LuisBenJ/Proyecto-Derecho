/* =========================================================
   APLICACIÓN
   Navegación, buscador y renderizado de las unidades.
   ========================================================= */

const app = document.getElementById("app");

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

function mostrarInicio() {
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
        <a href="#temas">
          <button class="btn" type="button">Ver unidades</button>
        </a>
      </div>
    </section>
  `;
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

function mostrarLista(filtro = "") {
  const termino = filtro.trim().toLowerCase();

  const resultados = UNIDADES.filter((unidad) =>
    contenidoBuscable(unidad).includes(termino)
  );

  app.innerHTML = `
    <div class="top">
      <button class="back" id="btn-inicio" type="button">← Inicio</button>

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
      <div class="unit-header">
        <div class="tag">Contenido de la materia</div>
        <h2>Temas de interés</h2>
        <p class="lead">
          Selecciona una unidad para estudiar primero la idea principal y
          después sus subtemas.
        </p>
      </div>

      <div class="grid">
        ${
          resultados.length
            ? resultados.map((unidad) => `
                <article class="card" data-unidad="${unidad.n}" tabindex="0" role="button">
                  <img src="${unidad.image}" alt="Ilustración de ${esc(unidad.t)}">
                  <div class="card-body">
                    <h3>Unidad ${unidad.n}. ${esc(unidad.t)}</h3>
                    <small>${esc(unidad.h)}</small>
                  </div>
                </article>
              `).join("")
            : `<p class="empty">No se encontraron coincidencias.</p>`
        }
      </div>
    </div>
  `;

  document.getElementById("btn-inicio").addEventListener("click", () => ir(""));

  const buscador = document.getElementById("buscador");
  buscador.focus();
  buscador.setSelectionRange(filtro.length, filtro.length);

  buscador.addEventListener("input", (event) => {
    mostrarLista(event.target.value);
  });

  document.querySelectorAll("[data-unidad]").forEach((card) => {
    const abrir = () => ir(`u${card.dataset.unidad}`);

    card.addEventListener("click", abrir);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        abrir();
      }
    });
  });
}

function mostrarUnidad(numero) {
  const unidad = unidadPorNumero(numero);

  if (!unidad) {
    mostrarInicio();
    return;
  }

  app.innerHTML = `
    <div class="top">
      <button class="back" id="btn-temas" type="button">← Temas</button>
      <span class="crumb">Unidad ${unidad.n}</span>
    </div>

    <div class="wrap">
      <header class="unit-header">
        <div class="tag">Unidad ${unidad.n} · ${esc(unidad.h)}</div>
        <h2>${esc(unidad.t)}</h2>
        <p class="lead">${esc(unidad.d)}</p>
      </header>

      <div class="hero-image">
        <img src="${unidad.image}" alt="Ilustración relacionada con ${esc(unidad.t)}">
      </div>

      <section class="info-section">
        <h3>${esc(unidad.main_title)}</h3>
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

      <h3 class="section-title">Subtemas</h3>

      <div class="subs">
        ${unidad.s.map(([titulo], index) => `
          <button
            class="sub"
            type="button"
            data-subtema="${index + 1}"
          >
            <b>${unidad.n}.${index + 1}</b>
            <span>${esc(titulo)}</span>
          </button>
        `).join("")}
      </div>

      <section class="sources">
        <h3>Fuentes de consulta</h3>
        ${unidad.sources.map(([nombre, url]) => `
          <a href="${url}" target="_blank" rel="noopener noreferrer">
            ${esc(nombre)}
          </a>
        `).join("")}
      </section>
    </div>
  `;

  document.getElementById("btn-temas").addEventListener("click", () => ir("temas"));

  document.querySelectorAll("[data-subtema]").forEach((button) => {
    button.addEventListener("click", () => {
      ir(`u${unidad.n}-${button.dataset.subtema}`);
    });
  });

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

  app.innerHTML = `
    <div class="top">
      <button class="back" id="btn-unidad" type="button">
        ← Unidad ${unidad.n}
      </button>
      <span class="crumb">${unidad.n}.${indice} ${esc(titulo)}</span>
    </div>

    <div class="wrap">
      <div class="tag">Unidad ${unidad.n} · ${esc(unidad.t)}</div>
      <h2>${unidad.n}.${indice} ${esc(titulo)}</h2>

      <div class="hero-image">
        <img src="${unidad.image}" alt="Ilustración de ${esc(unidad.t)}">
      </div>

      <section class="info-section topic-box">
        <h3>¿De qué trata?</h3>
        <p class="topic-description">${esc(descripcion)}</p>
      </section>

      <div class="nav">
        ${
          anterior
            ? `<button class="back" id="btn-anterior" type="button">← Anterior</button>`
            : `<span></span>`
        }

        ${
          siguiente
            ? `<button class="back" id="btn-siguiente" type="button">Siguiente →</button>`
            : `<span></span>`
        }
      </div>
    </div>
  `;

  document.getElementById("btn-unidad").addEventListener("click", () => {
    ir(`u${unidad.n}`);
  });

  if (anterior) {
    document.getElementById("btn-anterior").addEventListener("click", () => {
      ir(`u${unidad.n}-${indice - 1}`);
    });
  }

  if (siguiente) {
    document.getElementById("btn-siguiente").addEventListener("click", () => {
      ir(`u${unidad.n}-${indice + 1}`);
    });
  }

  window.scrollTo(0, 0);
}

function manejarRuta() {
  const hash = location.hash.slice(1);

  if (hash === "temas") {
    mostrarLista();
    return;
  }

  const match = hash.match(/^u([1-7])(?:-(\d+))?$/);

  if (!match) {
    mostrarInicio();
    return;
  }

  const numero = Number(match[1]);
  const indice = match[2] ? Number(match[2]) : null;

  if (indice) {
    mostrarSubtema(numero, indice);
  } else {
    mostrarUnidad(numero);
  }
}

window.addEventListener("hashchange", manejarRuta);
manejarRuta();
