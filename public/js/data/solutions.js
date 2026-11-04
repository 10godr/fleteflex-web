/*
 * Las 8 soluciones del sitio actual, con sus textos tal cual.
 * `service` es el servicio que se preselecciona en el cotizador al pulsar la tarjeta.
 * Imágenes en public/images/soluciones. Aduanas y Vehículos siguen siendo recortes provisionales
 * de los banners del sitio original hasta recibir foto propia. `position` ajusta el encuadre (object-position).
 */
export const SOLUTIONS = [
  {
    title: "Comercio internacional",
    description: "Conecta proveedores, fabricantes y compras con la planificación de tu operación.",
    service: "Compras Internacionales / Sourcing",
    image: "comercio",
    alt: "Contenedores de carga apilados en un puerto",
    items: [
      "Búsqueda de Proveedores",
      "Inspección de Mercados",
      "Negociación con Fabricantes",
      "Administración Integral de Compras",
      "Compras Internacionales / Sourcing",
    ],
  },
  {
    title: "Flete marítimo",
    description: "Contenedor completo o carga consolidada, según el volumen y las necesidades de tu mercancía.",
    service: "Flete Marítimo FCL",
    image: "maritimo",
    alt: "Buque de carga navegando en el horizonte con contenedores a bordo",
    items: [
      "Gestión de Contenedor 20 pies (20')",
      "Gestión de Contenedor 40 pies (40')",
      "Flete Marítimo FCL",
      "Flete Marítimo LCL",
      "Consolidación de Carga",
      "Desconsolidación de Carga",
    ],
  },
  {
    title: "Flete aéreo y courier",
    description: "Modalidades de transporte internacional para cargas comerciales y envíos por courier.",
    service: "Flete Aéreo Internacional",
    image: "aereo",
    alt: "Carga aérea descargándose de un avión en la pista",
    items: [
      "Flete Aéreo Internacional",
      "Courier Internacional",
      "Coordinación Logística Puerta a Puerta",
      "Seguro de Carga",
    ],
  },
  {
    title: "Aduanas y cumplimiento",
    description: "Coordinación documental y asesoría para los procesos de comercio exterior.",
    service: "Gestión Aduanal",
    image: "aduanas",
    fullWidth: 960,
    alt: "Agente de aduanas revisando un manifiesto frente a un camión y contenedores",
    items: [
      "Gestión Aduanal",
      "Clasificación Arancelaria",
      "Asesoría Aduanera",
      "Regularizaciones",
      "Exoneraciones",
      "Consultoría en Comercio Exterior",
    ],
  },
  {
    title: "Almacenaje y operaciones",
    description: "Servicios para recibir, organizar y preparar la mercancía para su siguiente etapa.",
    service: "Almacenamiento",
    image: "almacenaje",
    alt: "Almacén con cajas apiladas sobre pallets",
    items: [
      "Recepción de Carga",
      "Almacenamiento",
      "Almacenamiento Internacional",
      "Control de Inventario",
      "Preparación de Pedidos",
      "Reempaque y Etiquetado",
    ],
  },
  {
    title: "Distribución y logística local",
    description: "Conecta puertos, aeropuertos, almacenes y clientes mediante transporte nacional.",
    service: "Transporte Terrestre",
    image: "terrestre",
    position: "50% 40%",
    alt: "Repartidora revisando paquetes dentro de una camioneta de carga",
    items: [
      "Transporte Terrestre",
      "Distribución Nacional",
      "Entrega de Última Milla",
      "Entrega a Centros de Distribución",
      "Entrega a Almacenes",
      "Entrega Directa al Cliente",
    ],
  },
  {
    title: "Carga especial y maquinarias",
    description: "Planificación para equipos pesados, maquinaria industrial y cargas de manejo especializado.",
    service: "Carga de Proyecto / Carga Sobredimensionada",
    image: "maquinarias",
    alt: "Retroexcavadora sobre una plataforma de transporte",
    items: ["Carga de Proyecto / Carga Sobredimensionada", "Importación de Maquinarias y Equipos"],
  },
  {
    title: "Vehículos y mudanzas",
    description: "Coordinación de transporte internacional para vehículos, camiones y efectos personales.",
    service: "Importación de Vehículos",
    image: "vehiculos",
    fullWidth: 960,
    alt: "Vehículo todoterreno saliendo de un buque de transporte de vehículos",
    items: ["Importación de Vehículos", "Importación de Camiones", "Mudanzas Internacionales"],
  },
];
