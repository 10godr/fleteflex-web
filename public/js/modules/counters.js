import { lib } from "../core/gsap.js";
import { ORIGINS } from "../data/origins.js";
import { SOLUTIONS } from "../data/solutions.js";

/** Cifras reales del propio sitio (no se inventa nada): se calculan de los mismos datos que se muestran. */
const VALUES = {
  origins: ORIGINS.length,
  services: SOLUTIONS.reduce((total, solution) => total + solution.items.length, 0),
  modalities: 3, // marítimo, aéreo y terrestre
};

export function initCounters({ animated }) {
  const counters = [...document.querySelectorAll("[data-count]")];

  counters.forEach((el) => (el.textContent = VALUES[el.dataset.count]));
  if (!animated || !counters.length) return;

  const { gsap } = lib;

  counters.forEach((el, i) => {
    const target = VALUES[el.dataset.count];
    const counter = { n: 0 };
    el.textContent = "0";

    gsap.to(counter, {
      n: target,
      duration: 1.6,
      delay: i * 0.12,
      ease: "expo.out",
      onUpdate: () => (el.textContent = Math.round(counter.n)),
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
    });
  });
}
