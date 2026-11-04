/**
 * Velo de marca para las imágenes: fondo azul oscuro (#071930) con el logo de FleteFlex al centro.
 * Cubre la foto y se retira dejándola ver. Se anima con clip-path (no con scale) para que el logo
 * nunca se deforme. Los estados iniciales viven en reveal.css.
 */
export const CLIP = {
  closedLeft: "inset(0 100% 0 0)", // recogido, listo para cubrir de izquierda a derecha
  covering: "inset(0% 0% 0% 0%)", // cubre toda la imagen
  closedRight: "inset(0% 0% 0% 100%)", // recogido hacia la derecha, imagen visible
};

const LOGO_SRC = "images/logo-fleteflex-blanco.webp";

/** Agrega el velo a una figura (idempotente) y devuelve { veil, logo }. */
export function addVeil(figure) {
  let veil = figure.querySelector(".curtain__veil");

  if (!veil) {
    veil = document.createElement("span");
    veil.className = "curtain__veil";
    veil.setAttribute("aria-hidden", "true");
    veil.innerHTML = `<img class="curtain__logo" src="${LOGO_SRC}" alt="" width="573" height="130" decoding="async">`;
    figure.append(veil);
  }

  return { veil, logo: veil.querySelector(".curtain__logo") };
}
