import { SOLUTIONS } from "../data/solutions.js";
import { ORIGINS } from "../data/origins.js";
import { ADVISORY_SERVICES, QUOTE_TARGET, QUOTE_TEST_NUMBER, WHATSAPP_NUMBER } from "../data/quote.js";
import { validate } from "./quote-validate.js";
import { buildMessage, whatsappUrl } from "./quote-message.js";
import { LIMITS, cleanBlock, cleanLine, cleanNumber } from "./quote-sanitize.js";

/**
 * Cotizador en una sola pantalla. No envía nada a un servidor: arma el mensaje y abre
 * WhatsApp con el chat del equipo comercial; el cliente solo toca "Enviar" allá.
 */
// 900 ms de espera + 1200 ms de animación (quote.css) + margen
const PREFILL_MAX_MS = 3200;

// Evita abrir WhatsApp varias veces por doble clic o Enter repetido
const RESUBMIT_LOCK_MS = 1500;

export function initQuoteForm() {
  const form = document.getElementById("quote-form");
  if (!form) return;

  if (QUOTE_TEST_NUMBER) {
    console.warn(`[fleteflex] Cotizador en MODO PRUEBA: envía a +${QUOTE_TARGET} (real: +${WHATSAPP_NUMBER}).`);
  }

  let locked = false;
  const status = form.querySelector("[data-quote-status]");
  const control = (name) => form.elements[name];
  const fieldOf = (name) => control(name).closest(".field");

  /* Opciones: servicios agrupados por solución y orígenes sugeridos */
  control("service").insertAdjacentHTML(
    "beforeend",
    SOLUTIONS.map(
      (s) =>
        `<optgroup label="${s.title}">${s.items.map((item) => `<option>${item}</option>`).join("")}</optgroup>`,
    ).join(""),
  );
  form.querySelector("#origin-list").innerHTML = ORIGINS.map((o) => `<option value="${o}">`).join("");

  /* Los servicios de asesoría no piden carga: se ocultan peso y bultos y cambian las etiquetas */
  const isCargo = () => !ADVISORY_SERVICES.has(control("service").value);

  function applyService() {
    const cargo = isCargo();

    form.querySelectorAll("[data-cargo-only]").forEach((field) => {
      field.hidden = !cargo;
      field.querySelectorAll("input").forEach((input) => (input.disabled = !cargo));
    });
    ["origin", "destination"].forEach((name) => {
      control(name).setAttribute("aria-required", String(cargo));
    });
    form.querySelectorAll("[data-cargo]").forEach((label) => {
      label.innerHTML = cargo ? label.dataset.cargo : label.dataset.advisory;
    });
    control("description").placeholder = cargo
      ? "Producto, medidas y requisitos especiales"
      : "Objetivo de la consulta o proceso que necesitas coordinar";
  }

  function showErrors(errors) {
    ["service", "origin", "destination", "weight", "pieces", "description", "name", "email"].forEach((name) => {
      const input = control(name);
      const message = errors[name];
      const field = fieldOf(name);
      const output = field.querySelector(".field__error");

      field.classList.toggle("has-error", Boolean(message));
      input.setAttribute("aria-invalid", String(Boolean(message)));
      output.textContent = message ?? "";
    });
  }

  /**
   * Resalta un momento el campo que acaba de preseleccionarse (desde "Cotizar envío" o un país
   * del mapa). La animación espera a que el scroll llegue al formulario (retraso en quote.css).
   */
  function acknowledge(name) {
    const field = fieldOf(name);
    field.classList.remove("is-prefilled");
    void field.offsetWidth; // reinicia la animación si se pulsa dos veces seguidas
    field.classList.add("is-prefilled");
    // Tope de seguridad por si el navegador no dispara animationend (pestaña en segundo plano, etc.)
    setTimeout(() => field.classList.remove("is-prefilled"), PREFILL_MAX_MS);
  }

  form.addEventListener("animationend", (event) => {
    if (event.animationName === "field-prefilled") event.target.closest(".field")?.classList.remove("is-prefilled");
  });

  function readData() {
    const data = {};
    new FormData(form).forEach((value, key) => {
      if (key === "weight" || key === "pieces") data[key] = cleanNumber(value);
      else if (key === "description") data[key] = cleanBlock(value, LIMITS.description);
      else data[key] = cleanLine(value, LIMITS[key] ?? 200);
    });
    return data;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.hidden = true;

    const data = readData();
    const errors = validate(data, isCargo());
    showErrors(errors);

    const firstInvalid = Object.keys(errors)[0];
    if (firstInvalid) {
      control(firstInvalid).focus();
      return;
    }

    if (locked) return;
    locked = true;
    setTimeout(() => (locked = false), RESUBMIT_LOCK_MS);

    const url = whatsappUrl(buildMessage(data, isCargo()));
    try {
      window.open(url, "_blank", "noopener");
    } catch {
      // El enlace del aviso permite abrirlo a mano
    }

    // No se afirma que WhatsApp "se abrió": con noopener el navegador no permite comprobarlo
    status.hidden = false;
    status.replaceChildren(
      "Tu solicitud está lista en WhatsApp, pero todavía no se ha enviado: revisa el mensaje y pulsa Enviar. Si WhatsApp no se abrió solo, ",
      Object.assign(document.createElement("a"), { href: url, target: "_blank", rel: "noopener", textContent: "Abrir WhatsApp con mi solicitud" }),
      ".",
    );
  });

  form.addEventListener("input", (event) => {
    const field = event.target.closest(".field");
    if (!field?.classList.contains("has-error")) return;
    field.classList.remove("has-error");
    event.target.setAttribute("aria-invalid", "false");
    field.querySelector(".field__error").textContent = "";
  });

  control("service").addEventListener("change", applyService);
  applyService();

  /* Cualquier botón con data-service o data-origin preselecciona el campo correspondiente */
  document.addEventListener("click", (event) => {
    const serviceTrigger = event.target.closest("[data-service]");
    if (serviceTrigger && [...control("service").options].some((o) => o.value === serviceTrigger.dataset.service)) {
      control("service").value = serviceTrigger.dataset.service;
      applyService();
      acknowledge("service");
    }

    const originTrigger = event.target.closest("[data-origin]");
    if (originTrigger) {
      control("origin").value = originTrigger.dataset.origin;
      acknowledge("origin");
    }
  });
}
