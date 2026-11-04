const query = window.matchMedia("(prefers-reduced-motion: reduce)");

/** true si el usuario pidió reducir movimiento (se lee una vez al arrancar). */
export const isReducedMotion = () => query.matches;

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
