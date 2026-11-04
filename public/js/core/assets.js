import { wait } from "./env.js";

const MAX_WAIT_MS = 800;

/**
 * Fuentes listas antes de animar el titular (con tope para no retrasar la página): así no se anima con la
 * tipografía de respaldo. No se espera a la foto del hero: se pinta sola cuando llega y retrasar el texto
 * por ella alargaba el LCP más de 2 s en conexiones lentas.
 */
export function assetsReady() {
  return Promise.race([document.fonts?.ready ?? Promise.resolve(), wait(MAX_WAIT_MS)]);
}
