import { lib } from "../core/gsap.js";
import { ORIGINS } from "../data/origins.js";

const DWELL_SECONDS = 3.2;

/**
 * Tarjeta del hero que recorre los orígenes con una barra de progreso.
 * Se pausa si la pestaña está oculta, si el hero sale de pantalla o si el
 * usuario la señala o enfoca. Con movimiento reducido queda estática.
 */
export function initRouteCard() {
  const { gsap } = lib;
  const card = document.querySelector("[data-route-card]");
  if (!card) return { start() {} };

  const originEl = card.querySelector("[data-route-origin]");
  const barEl = card.querySelector("[data-route-bar]");
  const countEl = card.querySelector("[data-route-count]");

  let index = 0;
  let dwellTl = null;
  const pausedBy = new Set();

  // Solo se pausa la espera (la barra). El cambio de texto dura <1s y siempre termina.
  const setPause = (reason, on) => {
    on ? pausedBy.add(reason) : pausedBy.delete(reason);
    dwellTl?.paused(pausedBy.size > 0);
  };

  function swapOrigin() {
    dwellTl = null;
    gsap
      .timeline({ onComplete: dwell })
      .to(originEl, { yPercent: -100, opacity: 0, duration: 0.22, ease: "power3.out" })
      .add(() => {
        index = (index + 1) % ORIGINS.length;
        originEl.textContent = ORIGINS[index];
        countEl.textContent = `${index + 1} / ${ORIGINS.length}`;
      })
      .fromTo(originEl, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: "expo.out" });
  }

  function dwell() {
    dwellTl = gsap
      .timeline({ paused: pausedBy.size > 0, onComplete: swapOrigin })
      .fromTo(barEl, { scaleX: 0 }, { scaleX: 1, duration: DWELL_SECONDS, ease: "none" });
  }

  document.addEventListener("visibilitychange", () => setPause("hidden", document.hidden));
  card.addEventListener("pointerenter", () => setPause("hover", true));
  card.addEventListener("pointerleave", () => setPause("hover", false));
  card.addEventListener("focusin", () => setPause("focus", true));
  card.addEventListener("focusout", () => setPause("focus", false));

  new IntersectionObserver(([entry]) => setPause("offscreen", !entry.isIntersecting)).observe(card);

  // La rotación arranca cuando el hero ya entró (después de la entrada del hero)
  return { start: dwell };
}
