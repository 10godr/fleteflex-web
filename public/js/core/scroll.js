import { lib } from "./gsap.js";

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Devuelve una interfaz única de scroll: Lenis (inercia) cuando hay movimiento,
 * y scroll nativo cuando el usuario pidió reducirlo.
 */
export function createScroller(reduced) {
  if (reduced) {
    return {
      scrollTo: (target) => {
        const el = typeof target === "string" ? document.querySelector(target) : target;
        el?.scrollIntoView({ behavior: "auto" });
      },
      stop() {},
      start() {},
    };
  }

  const { gsap, ScrollTrigger, Lenis } = lib;
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return {
    // immediate: salto directo (enlaces con #sección al cargar); por defecto, desplazamiento animado
    scrollTo: (target, { immediate = false } = {}) =>
      lenis.scrollTo(target, immediate ? { immediate: true } : { duration: 1.4, easing: easeOutExpo }),
    stop: () => lenis.stop(),
    start: () => lenis.start(),
  };
}
