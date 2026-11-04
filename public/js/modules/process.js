import { lib } from "../core/gsap.js";

/** La línea de ruta de "Cómo empezamos" se dibuja con el scroll y enciende cada paso. */
export function initProcess() {
  const track = document.querySelector("[data-process]");
  if (!track) return;

  const { ScrollTrigger } = lib;
  const steps = [...track.querySelectorAll(".process__step")];

  track.style.setProperty("--p", "0");

  ScrollTrigger.create({
    trigger: track,
    start: "top 78%",
    end: "bottom 60%",
    onUpdate: (self) => {
      track.style.setProperty("--p", self.progress.toFixed(3));
      steps.forEach((step, i) => step.classList.toggle("is-on", self.progress >= i / (steps.length - 1) - 0.02));
    },
  });
}
