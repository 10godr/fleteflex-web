/** Datos del cotizador: canal de WhatsApp y qué servicios son de asesoría (sin peso ni bultos). */

/** Número real de atención comercial (el que se muestra en el sitio). */
export const WHATSAPP_NUMBER = "18299561246";

/**
 * MODO PRUEBA: mientras tenga un número, el formulario envía a ese número en lugar del real.
 * El número visible del sitio y los demás botones de WhatsApp no cambian.
 * Antes de publicar, dejar en "" para que el formulario use WHATSAPP_NUMBER.
 */
export const QUOTE_TEST_NUMBER = "18095096584";

export const QUOTE_TARGET = QUOTE_TEST_NUMBER || WHATSAPP_NUMBER;

export const ADVISORY_SERVICES = new Set([
  "Compras Internacionales / Sourcing",
  "Búsqueda de Proveedores",
  "Inspección de Mercados",
  "Negociación con Fabricantes",
  "Administración Integral de Compras",
  "Clasificación Arancelaria",
  "Asesoría Aduanera",
  "Regularizaciones",
  "Exoneraciones",
  "Consultoría en Comercio Exterior",
]);
