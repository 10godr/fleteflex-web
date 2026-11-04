import { lib } from "../core/gsap.js";
import { SOLUTIONS } from "../data/solutions.js";
import { renderSlides } from "./solutions-render.js";
import { addVeil, CLIP } from "./veil.js";

const SWIPE_MIN_PX = 50;

/**
 * Slider de soluciones: flechas, teclado (← →) y deslizar en táctil.
 * Único lugar con el telón de marca: al CAMBIAR de solución (no al cargar ni al aparecer), un fondo
 * azul oscuro con el logo cubre la foto que sale, cambia el contenido y se retira de la foto
 * que entra (~1.1 s). El texto entra con un fundido escalonado. Sin animación: cambio directo.
 */
export function initSolutions({ animated }) {
  const root = document.querySelector("[data-solutions]");
  if (!root) return;

  const stage = root.querySelector("[data-solutions-stage]");
  const slides = renderSlides(stage, SOLUTIONS);
  const count = root.querySelector("[data-solutions-count]");
  const progress = root.querySelector("[data-solutions-progress]");
  const announce = root.querySelector("[data-solutions-status]");
  const total = slides.length;

  let index = 0;
  let timeline = null;

  const parts = (slide) => slide.querySelectorAll(".slide__title, .slide__desc, .slide__list li, .slide__cta");
  const images = slides.map((slide) => slide.querySelector(".slide__media > img"));
  /** Carga la foto de una diapositiva si todavía no se ha pedido. */
  function loadImage(i) {
    const img = images[(i + total) % total];
    if (!img.dataset.src) return;
    img.srcset = img.dataset.srcset;
    img.src = img.dataset.src;
    delete img.dataset.src;
    delete img.dataset.srcset;
  }
  const loadAround = (i) => [i - 1, i, i + 1].forEach(loadImage);

  // Al acercarse a la sección se piden las vecinas de la primera (siguiente y anterior)
  new IntersectionObserver(
    ([entry], observer) => {
      if (!entry.isIntersecting) return;
      loadAround(0);
      observer.disconnect();
    },
    { rootMargin: "900px 0px" },
  ).observe(stage);

  const veils = animated ? slides.map((slide) => addVeil(slide.querySelector(".slide__media"))) : [];

  function setActiveState(next) {
    slides.forEach((slide, i) => {
      const active = i === next;
      slide.classList.toggle("is-active", active);
      slide.inert = !active;
      slide.setAttribute("aria-hidden", String(!active));
    });
    count.textContent = `${next + 1} / ${total}`;
    progress.style.transform = `scaleX(${(next + 1) / total})`;
  }

  /** Deja todo en reposo después de una transición (o de interrumpirla). */
  function settle() {
    const { gsap } = lib;
    gsap.set(
      veils.map((v) => v.veil),
      { clipPath: CLIP.closedLeft },
    );
    gsap.set(
      veils.map((v) => v.logo),
      { opacity: 0 },
    );
    gsap.set(images, { scale: 1 });
    gsap.set(slides.flatMap((slide) => [...parts(slide)]), { clearProps: "opacity,transform" });
    gsap.set(
      slides.map((slide) => slide.querySelector(".slide__panel")),
      { clearProps: "opacity" },
    );
  }

  function go(target) {
    const next = (target + total) % total;
    if (next === index) return;

    // Interrumpir: terminar al instante la transición en curso antes de empezar otra
    if (timeline?.isActive()) timeline.progress(1);

    const from = index;
    index = next;
    loadAround(next);
    // Anuncio para lectores de pantalla (solo cuando la persona cambia de solución, no al cargar)
    announce.textContent = `Solución ${next + 1} de ${total}: ${SOLUTIONS[next].title}`;

    if (!animated) {
      setActiveState(next);
      return;
    }

    const { gsap } = lib;
    const out = veils[from];
    const into = veils[next];
    const to = slides[next];

    count.textContent = `${next + 1} / ${total}`;
    progress.style.transform = `scaleX(${(next + 1) / total})`;

    timeline = gsap
      .timeline({ onComplete: settle })
      // Sale: el velo cubre la foto actual y su texto se desvanece
      .set(out.veil, { clipPath: CLIP.closedLeft })
      .to(out.veil, { clipPath: CLIP.covering, duration: 0.4, ease: "expo.inOut" }, 0)
      .fromTo(out.logo, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.35, ease: "expo.out" }, 0.2)
      .to(slides[from].querySelector(".slide__panel"), { opacity: 0, duration: 0.2, ease: "power2.out" }, 0)
      // Cambio de contenido debajo del velo
      .add(() => {
        setActiveState(next);
        gsap.set(into.veil, { clipPath: CLIP.covering });
        gsap.set(into.logo, { opacity: 1, scale: 1 });
        gsap.set(images[next], { scale: 1.12 });
        gsap.set(parts(to), { opacity: 0, y: 18 });
      })
      // Entra: el velo se retira de la foto nueva y aparece el texto
      .to(into.veil, { clipPath: CLIP.closedRight, duration: 0.55, ease: "expo.inOut" }, "+=0.12")
      .to(into.logo, { opacity: 0, duration: 0.25, ease: "power2.out" }, "<")
      .to(images[next], { scale: 1, duration: 1, ease: "expo.out" }, "<0.1")
      .to(parts(to), { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.04 }, "<0.15");
  }

  setActiveState(0);

  /* Controles */
  root.querySelector("[data-solutions-prev]").addEventListener("click", () => go(index - 1));
  root.querySelector("[data-solutions-next]").addEventListener("click", () => go(index + 1));

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") go(index - 1);
    if (event.key === "ArrowRight") go(index + 1);
  });

  // Deslizar en pantallas táctiles (el scroll vertical queda libre: touch-action: pan-y).
  // Solo cuenta el primer dedo: un segundo dedo no reinicia el gesto, y el gesto termina bien aunque se
  // suelte fuera del slider, el navegador lo cancele para hacer scroll o la ventana pierda el foco.
  let swipe = null;
  stage.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" || swipe) return;
    swipe = { id: event.pointerId, x: event.clientX, y: event.clientY };
  });
  document.addEventListener("pointerup", (event) => {
    if (!swipe || event.pointerId !== swipe.id) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) > SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1));
  });
  document.addEventListener("pointercancel", (event) => {
    if (swipe && event.pointerId === swipe.id) swipe = null;
  });
  window.addEventListener("blur", () => (swipe = null));
}
