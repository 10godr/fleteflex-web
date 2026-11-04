import { lockHeaderTheme, unlockHeaderTheme } from "./header-theme.js";

/**
 * Navegación: chip de acento que sigue a la sección activa (scroll-spy),
 * scroll suave a anclas y menú móvil accesible.
 */
export function initNav({ scroller }) {
  const nav = document.querySelector(".pill-nav");
  const chip = nav.querySelector(".pill-nav__chip");
  const links = [...nav.querySelectorAll("a")];

  /* --- Chip y scroll-spy --- */
  let activeLink = null;

  function placeChip() {
    if (!activeLink) {
      chip.classList.remove("is-visible");
      return;
    }
    chip.style.setProperty("--chip-x", `${activeLink.offsetLeft}px`);
    chip.style.setProperty("--chip-w", `${activeLink.offsetWidth}px`);
    chip.classList.add("is-visible");
  }

  function setActive(link) {
    if (link === activeLink) return;
    activeLink?.classList.remove("is-active");
    activeLink?.removeAttribute("aria-current");
    activeLink = link;
    activeLink?.classList.add("is-active");
    activeLink?.setAttribute("aria-current", "true");
    placeChip();
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = links.find((a) => a.hash === `#${entry.target.id}`);
        if (entry.isIntersecting) setActive(link);
        else if (activeLink === link) setActive(null);
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );

  links.forEach((a) => {
    const section = document.querySelector(a.hash);
    if (section) observer.observe(section);
  });

  new ResizeObserver(placeChip).observe(nav);
  document.fonts?.ready.then(placeChip);

  /* --- Menú móvil --- */
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("menu");
  const label = toggle.querySelector(".menu-toggle__label");
  const page = document.getElementById("contenido");

  function setMenu(open) {
    menu.classList.toggle("is-open", open);
    menu.toggleAttribute("inert", !open);
    page.toggleAttribute("inert", open);
    toggle.setAttribute("aria-expanded", String(open));
    label.textContent = open ? "Cerrar" : "Menú";
    // El menú móvil es oscuro: el header se pone en versión oscura mientras está abierto
    open ? lockHeaderTheme("dark") : unlockHeaderTheme();
    open ? scroller.stop() : scroller.start();
  }

  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  window.matchMedia("(min-width: 960px)").addEventListener("change", (event) => {
    if (event.matches && menu.classList.contains("is-open")) setMenu(false);
  });

  /* --- Anclas: scroll suave solo si la sección existe --- */
  document.addEventListener("click", (event) => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor || anchor.hash.length < 2) return;

    const target = document.querySelector(anchor.hash);
    if (!target) return;

    event.preventDefault();
    if (menu.classList.contains("is-open")) setMenu(false);
    // Sin pushState: la barra de direcciones se queda limpia (sin #seccion)
    scroller.scrollTo(target);
  });
}
