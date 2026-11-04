/**
 * Limpieza de lo que escribe la persona antes de armar el mensaje de WhatsApp.
 * - Quita caracteres de control, los que invierten el sentido del texto (U+202A a U+202E, U+2066 a U+2069)
 *   y los invisibles (U+200B, U+2060, U+FEFF).
 * - Conserva U+200C/U+200D (necesarios para emojis y escrituras que los usan) y U+200E/U+200F (marcas RTL).
 * - Recorta por caracteres reales (no parte un emoji por la mitad).
 *
 * Los rangos se escriben como números a propósito: así este archivo no contiene caracteres invisibles
 * ni de control de dirección (que en el código fuente son un vector de ataque conocido, "Trojan Source").
 */
export const LIMITS = { origin: 60, destination: 60, name: 80, email: 120, description: 600 };

/** Rangos de puntos de código a eliminar: [desde, hasta]. */
const UNSAFE_RANGES = [
  [0x00, 0x08],
  [0x0b, 0x0c],
  [0x0e, 0x1f],
  [0x7f, 0x7f],
  [0x200b, 0x200b],
  [0x2060, 0x2060],
  [0x202a, 0x202e],
  [0x2066, 0x2069],
  [0xfeff, 0xfeff],
];

const isUnsafe = (character) => {
  const code = character.codePointAt(0);
  return UNSAFE_RANGES.some(([from, to]) => code >= from && code <= to);
};

const strip = (text) => Array.from(String(text)).filter((character) => !isUnsafe(character)).join("");

const cut = (text, max) => Array.from(text).slice(0, max).join("");

/** Una sola línea: espacios y saltos se colapsan. */
export function cleanLine(value, max) {
  return cut(strip(value).replace(/\s+/g, " ").trim(), max);
}

/** Varias líneas: se conservan los saltos (máximo una línea vacía seguida). */
export function cleanBlock(value, max) {
  const text = strip(value)
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return cut(text, max);
}

/** "1e3" o " 450 " se escriben como "1000" y "450"; lo que no es número se deja para que la validación lo rechace. */
export function cleanNumber(value) {
  const text = String(value).trim();
  const number = Number(text);
  return text !== "" && Number.isFinite(number) ? String(number) : text;
}
