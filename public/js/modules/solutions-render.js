const escapeHtml = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Ancho que ocupa la foto: en escritorio ~58% del contenido (760 px), en celular todo el ancho
const IMAGE_SIZES = "(min-width: 900px) 760px, 100vw";

/**
 * La primera foto carga de entrada. Las demás llevan data-src y las carga solutions.js cuando la sección
 * se acerca o la persona cambia de solución (en datos móviles se evitan ~1 MB que quizá nunca se vean).
 * Cada foto tiene versión de 800 px y completa; el navegador elige según pantalla y densidad.
 */
function imageSource(solution, index) {
  const base = `images/soluciones/${solution.image}`;
  const srcset = `${base}-800.webp 800w, ${base}.webp ${solution.fullWidth ?? 1600}w`;
  return index === 0 ? `src="${base}.webp" srcset="${srcset}" loading="lazy"` : `data-src="${base}.webp" data-srcset="${srcset}"`;
}

function slideMarkup(solution, index, total) {
  const items = solution.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  return `
    <div class="slide" role="group" aria-roledescription="diapositiva" aria-label="${index + 1} de ${total}">
      <div class="slide__panel">
        <h3 class="slide__title">${escapeHtml(solution.title)}</h3>
        <p class="slide__desc">${escapeHtml(solution.description)}</p>
        <ul class="slide__list">${items}</ul>
        <a class="btn btn--dark slide__cta" href="#cotizar" data-service="${escapeHtml(solution.service)}">Cotizar envío</a>
      </div>
      <figure class="slide__media curtain">
        <img ${imageSource(solution, index)} alt="${escapeHtml(solution.alt)}"
             width="1600" height="1100" decoding="async" sizes="${IMAGE_SIZES}"
             ${solution.position ? `style="object-position:${solution.position}"` : ""}>
      </figure>
    </div>`;
}

/** Inserta las diapositivas en el escenario y devuelve sus elementos. */
export function renderSlides(stage, solutions) {
  stage.innerHTML = solutions.map((solution, i) => slideMarkup(solution, i, solutions.length)).join("");
  return [...stage.children];
}
