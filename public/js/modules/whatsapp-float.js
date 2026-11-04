/**
 * El botón flotante de WhatsApp aparece al salir del hero (para no tapar la tarjeta de orígenes) y se
 * oculta mientras el formulario o la sección de contacto están a la vista: ahí ya hay botones de WhatsApp
 * y el flotante taparía el botón de enviar en pantallas pequeñas.
 */
export function initWhatsappFloat() {
  const button = document.querySelector(".wa-float");
  const hero = document.querySelector(".hero");
  if (!button || !hero) return;

  const hidingSections = [...document.querySelectorAll("[data-hide-wa-float]")];
  let heroInView = true;
  const overlapping = new Set();

  const update = () => button.classList.toggle("is-visible", !heroInView && overlapping.size === 0);

  new IntersectionObserver(([entry]) => {
    heroInView = entry.intersectionRatio >= 0.25;
    update();
  }, { threshold: [0, 0.25, 1] }).observe(hero);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? overlapping.add(entry.target) : overlapping.delete(entry.target)));
      update();
    },
    { threshold: 0.15 },
  );
  hidingSections.forEach((section) => observer.observe(section));
}
