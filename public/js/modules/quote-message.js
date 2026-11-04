import { QUOTE_TARGET } from "../data/quote.js";

/** Una línea "*Etiqueta:* valor" (en WhatsApp, lo que va entre asteriscos sale en negrita). */
const line = (label, value) => `*${label}:* ${value}`;

/**
 * Mensaje de la solicitud, en bloques separados por una línea en blanco para que se lea bien
 * dentro de WhatsApp:
 *
 *   Hola, me interesa un servicio de *Flete Marítimo FCL*.
 *
 *   Estos son los datos de mi envío:
 *   *Origen:* China
 *   ...
 *
 * `cargo` es false en los servicios de asesoría (no hay peso ni bultos; origen y destino son opcionales).
 */
export function buildMessage(data, cargo) {
  const route = [
    data.origin && line("Origen", data.origin),
    data.destination && line("Destino", data.destination),
  ].filter(Boolean);

  const blocks = [`Hola, me interesa un servicio de *${data.service}*.`];

  if (cargo) {
    const shipment = [...route, line("Peso", `${data.weight} kg`), line("Bultos", data.pieces)];
    blocks.push(["Estos son los datos de mi envío:", ...shipment].join("\n"));
    blocks.push(`*Descripción de la mercancía:*\n${data.description}`);
  } else {
    blocks.push(`Esto es lo que necesito:\n${data.description}`);
    if (route.length) blocks.push(["Datos de la operación:", ...route].join("\n"));
  }

  const contact = [line("Nombre o empresa", data.name), data.email && line("Correo", data.email)].filter(Boolean);
  blocks.push(["Mis datos de contacto:", ...contact].join("\n"));

  blocks.push("Quedo atento(a) a su respuesta. Gracias.");

  return blocks.join("\n\n");
}

export const whatsappUrl = (text) => `https://wa.me/${QUOTE_TARGET}?text=${encodeURIComponent(text)}`;
