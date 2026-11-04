const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Topes para detectar errores de tipeo (un cero de más), no restricciones del negocio
const MAX_WEIGHT_KG = 9_999_999;
const MAX_PIECES = 99_999;

/**
 * Valida la solicitud. Devuelve { campo: mensaje } solo con los campos con error.
 * `cargo` es false para servicios de asesoría (no piden origen, destino, peso ni bultos).
 */
export function validate(data, cargo) {
  const errors = {};

  if (!data.service) errors.service = "Elige el servicio que necesitas.";

  if (cargo) {
    if (!data.origin) errors.origin = "Indica el país o ciudad de origen.";
    if (!data.destination) errors.destination = "Indica la ciudad o el país de destino.";

    const weight = Number(data.weight);
    if (!data.weight || !Number.isFinite(weight) || weight <= 0) errors.weight = "Escribe el peso estimado en kilos (mayor que cero).";
    else if (weight > MAX_WEIGHT_KG) errors.weight = "El peso parece demasiado alto. Revisa que esté en kilos.";

    const pieces = Number(data.pieces);
    if (!data.pieces || !Number.isInteger(pieces) || pieces < 1) errors.pieces = "Escribe cuántos bultos son (mínimo 1).";
    else if (pieces > MAX_PIECES) errors.pieces = "La cantidad parece demasiado alta. Revisa el número de bultos.";
  }

  if (!data.description) {
    errors.description = cargo ? "Describe tu mercancía (producto y medidas aproximadas)." : "Cuéntanos qué necesitas resolver.";
  }

  if (!data.name) errors.name = "Escribe tu nombre o el de tu empresa.";
  if (data.email && !EMAIL.test(data.email)) errors.email = "El correo no parece válido. Usa el formato nombre@empresa.com.";

  return errors;
}
