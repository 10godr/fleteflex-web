import { lib } from "../core/gsap.js";

/**
 * Revela un titular por líneas (cada línea sube desde una máscara).
 * SplitText re-divide solo si cambia el ancho (autoSplit), así que las líneas
 * siempre corresponden al layout actual, también en móvil.
 *
 * @param {HTMLElement} el
 * @param {{ paused?: boolean, start?: string }} options
 *   paused: no reproducir hasta llamar a play() (hero, tras cargar fuentes y foto).
 */
export function splitReveal(el, { paused = false, start = "top 85%" } = {}) {
  const { gsap, SplitText } = lib;
  let tween;
  let played = false;

  SplitText.create(el, {
    type: "lines",
    mask: "lines",
    linesClass: "line",
    autoSplit: true,
    onSplit(self) {
      // Reserva abajo para que la máscara no recorte descendentes (p, y, g) de la cursiva
      self.masks.forEach((mask) => {
        mask.style.paddingBottom = "0.16em";
        mask.style.marginBottom = "-0.16em";
      });

      tween = gsap.from(self.lines, {
        yPercent: 115,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.09,
        paused,
        scrollTrigger: paused ? undefined : { trigger: el, start, once: true },
      });
      if (played) tween.progress(1);
      return tween;
    },
  });

  return {
    play() {
      played = true;
      tween?.play();
    },
  };
}
