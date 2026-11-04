/*
 * GSAP, ScrollTrigger, SplitText y Lenis se cargan como scripts locales
 * (public/vendor, versiones fijas) y quedan en `window`. Este módulo los registra
 * una sola vez y los reexporta para el resto de módulos.
 */
export function registerPlugins() {
  const { gsap, ScrollTrigger, SplitText, Lenis } = window;
  if (!gsap || !ScrollTrigger || !SplitText || !Lenis) return false;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  return true;
}

export const lib = {
  get gsap() {
    return window.gsap;
  },
  get ScrollTrigger() {
    return window.ScrollTrigger;
  },
  get SplitText() {
    return window.SplitText;
  },
  get Lenis() {
    return window.Lenis;
  },
};
