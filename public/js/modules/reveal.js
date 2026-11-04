import { splitReveal } from "./text-reveal.js";

/**
 * Revelación de titulares por líneas ([data-lines]). Se usa a propósito en muy pocos sitios: el hero
 * (hero.js) y los titulares de Nosotros y de Cotizar. Más entradas iguales cansan y restan peso a las importantes.
 */
export function initReveals() {
  // Dividir un titular en líneas cuesta ~5 ms; hacerlo con todos al arrancar bloqueaba ~50 ms.
  // Cada uno se divide cuando está a menos de 1.5 pantallas por debajo (siempre antes de que se vea).
  const lazySplit = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        splitReveal(entry.target);
      });
    },
    { rootMargin: "0px 0px 150% 0px" },
  );

  document.querySelectorAll("[data-lines]").forEach((el) => lazySplit.observe(el));
}
