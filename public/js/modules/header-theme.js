/**
 * El header es transparente con logo blanco sobre secciones oscuras (hero) y pasa a
 * barra clara con logo original sobre secciones claras. Cada sección declara su tema
 * con data-header-theme; se observa la franja de 1px donde está el centro del header.
 * Si varias secciones cruzan esa franja (el hero queda fijo debajo de la siguiente),
 * gana la última en el DOM, que es la que está encima.
 */
const header = document.querySelector(".site-header");

let sectionTheme = header?.dataset.theme ?? "dark";
let locked = null;

const apply = () => {
  if (header) header.dataset.theme = locked ?? sectionTheme;
};

/** Fuerza un tema (p. ej. oscuro mientras el menú móvil está abierto). */
export const lockHeaderTheme = (theme) => {
  locked = theme;
  apply();
};

export const unlockHeaderTheme = () => {
  locked = null;
  apply();
};

export function initHeaderTheme() {
  const sections = [...document.querySelectorAll("[data-header-theme]")];
  if (!header || !sections.length) return;

  const crossing = new Set();
  let observer;

  const pick = () => {
    const top = [...crossing].sort((a, b) => sections.indexOf(b) - sections.indexOf(a))[0];
    if (!top) return;
    sectionTheme = top.dataset.headerTheme;
    apply();
  };

  function observe() {
    observer?.disconnect();
    crossing.clear();

    const line = Math.round(header.offsetHeight / 2);
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          entry.isIntersecting ? crossing.add(entry.target) : crossing.delete(entry.target),
        );
        pick();
      },
      { rootMargin: `-${line}px 0px -${window.innerHeight - line - 1}px 0px` },
    );
    sections.forEach((section) => observer.observe(section));
  }

  observe();
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(observe, 150);
  });
}
