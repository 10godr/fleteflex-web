import { lib } from "../core/gsap.js";
import { splitReveal } from "./text-reveal.js";

/**
 * Prepara la entrada del hero (estado inicial oculto) y devuelve play().
 * Se reproduce cuando las fuentes y la foto del hero están listas (assetsReady).
 */
export function prepareHeroIntro() {
  const { gsap } = lib;
  const title = splitReveal(document.querySelector(".hero__title"), { paused: true });

  const intro = gsap
    .timeline({ paused: true })
    .from(".hero__media img", { scale: 1.12, duration: 1.9, ease: "expo.out" }, 0)
    .from(".site-header__inner", { y: -16, opacity: 0, duration: 0.9, ease: "expo.out" }, 0.2)
    .from(
      [".hero__lead", ".hero__actions", ".route-card"],
      { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1 },
      0.25,
    );

  return {
    play() {
      title.play();
      intro.play();
    },
  };
}

/**
 * El hero queda fijo y la sección siguiente (clara) se desliza sobre él como un telón.
 * Mientras lo cubre, el hero se oscurece y su contenido sube y se desvanece.
 */
export function initHeroScroll() {
  const { gsap, ScrollTrigger } = lib;
  const hero = document.querySelector(".hero");
  const next = hero.nextElementSibling;

  // En pantallas muy bajas (celular en horizontal) el hero no se fija ni se desvanece: se desplaza
  // como cualquier sección, para que sus botones nunca queden tapados por la sección siguiente.
  gsap.matchMedia().add("(min-height: 440px)", () => {
    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: () => `+=${hero.offsetHeight}`,
      pin: true,
      pinSpacing: false,
    });

    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
      })
      .to(".hero__media img", { yPercent: 10, duration: 1 }, 0)
      .to(".hero__veil", { opacity: 0.78, duration: 1 }, 0)
      .to(".hero__inner", { y: -60, opacity: 0.15, duration: 1 }, 0);
  });
}
