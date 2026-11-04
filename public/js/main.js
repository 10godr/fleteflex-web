import { isReducedMotion } from "./core/env.js";
import { registerPlugins, lib } from "./core/gsap.js";
import { createScroller } from "./core/scroll.js";
import { assetsReady } from "./core/assets.js";
import { prepareHeroIntro, initHeroScroll } from "./modules/hero.js";
import { initReveals } from "./modules/reveal.js";
import { initRouteCard } from "./modules/route-card.js";
import { initNav } from "./modules/nav.js";
import { initHeaderTheme } from "./modules/header-theme.js";
import { initSolutions } from "./modules/solutions.js";
import { initProcess } from "./modules/process.js";
import { initCounters } from "./modules/counters.js";
import { initQuoteForm } from "./modules/quote-form.js";
import { initWhatsappFloat } from "./modules/whatsapp-float.js";

const root = document.documentElement;

/** Marcas de rendimiento (visibles en el panel Performance de DevTools): cuestan casi nada. */
const mark = (name) => performance.mark(`ff:${name}`);

/** Muestra todo sin animaciones (sin librerías, movimiento reducido o error). */
function showEverything() {
  root.classList.remove("is-motion");
  root.classList.add("is-ready");
}

/**
 * Si la dirección trae #seccion (un enlace compartido), se llega a ella ya con el layout final:
 * el salto nativo del navegador ocurre antes de que el hero fijo y sus espaciadores existan.
 */
function goToLinkedSection(scroller) {
  if (location.hash.length < 2) return;
  try {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) scroller.scrollTo(target, { immediate: true });
  } catch {
    // Hash mal formado: se ignora
  }
}

async function boot() {
  mark("boot");
  const reduced = isReducedMotion();
  const ready = registerPlugins();

  // Sin librerías o con movimiento reducido: sitio completo y estático, solo navegación
  const staticMode = !ready || reduced;
  if (staticMode) showEverything();

  const scroller = createScroller(staticMode);
  initNav({ scroller });
  initHeaderTheme();
  mark("nav");
  initQuoteForm();
  initWhatsappFloat();
  mark("form");
  initSolutions({ animated: !staticMode });
  mark("solutions");
  initCounters({ animated: !staticMode });
  if (staticMode) return;

  try {
    root.classList.add("is-motion");

    const heroIntro = prepareHeroIntro();
    mark("heroIntro");
    initHeroScroll();
    mark("heroScroll");
    initProcess();
    mark("process");
    initReveals();
    mark("reveals");
    const routeCard = initRouteCard();

    await assetsReady();
    mark("assets");
    root.classList.add("is-ready");
    heroIntro.play();
    routeCard.start();
    lib.ScrollTrigger.refresh();
    mark("refresh");

    goToLinkedSection(scroller);
    // Las hojas de las secciones de abajo se activan al cargar: se recalcula con el layout final
    window.addEventListener(
      "load",
      () => {
        lib.ScrollTrigger.refresh();
        goToLinkedSection(scroller);
      },
      { once: true },
    );
  } catch (error) {
    console.error("[fleteflex] Animaciones desactivadas:", error);
    lib.gsap.globalTimeline.clear();
    showEverything();
  }
}

boot();
