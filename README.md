# FleteFlex

Rediseño frontend de fleteflex.com. HTML, CSS y JavaScript sin paso de compilación.

## Estructura

Todo lo que se publica vive en `public/` (esa carpeta es la raíz del sitio):

```
public/
  index.html
  css/        estilos, un archivo por sección o componente (tokens, base, nav, hero, ...)
  js/
    main.js   punto de entrada
    core/     utilidades (scroll suave, GSAP, carga de recursos)
    data/     contenido editable (soluciones, orígenes, cotizador)
    modules/  una responsabilidad por archivo (nav, slider, formulario, ...)
  images/     fotos del sitio (soluciones/ tiene las del slider)
  fonts/      tipografía Hanken Grotesk, alojada localmente
  vendor/     GSAP, ScrollTrigger, SplitText y Lenis, con versión fija
```

Fuera de `public/` solo queda configuración y documentación del repositorio.

## Ver el sitio en local

Servir la carpeta `public/` con cualquier servidor estático, por ejemplo:

```
cd public
python -m http.server 5173
```

y abrir http://localhost:5173

Los módulos de JavaScript necesitan un servidor (no funcionan abriendo `index.html` con doble clic).

## Cotizador (WhatsApp)

El formulario arma un mensaje y abre WhatsApp; no envía nada a un servidor.
El destino se define en `public/js/data/quote.js`:

- `WHATSAPP_NUMBER`: número real de atención comercial.
- `QUOTE_TEST_NUMBER`: número de prueba. Mientras tenga valor, el formulario envía ahí.
  **Dejarlo en `""` antes de publicar.**

## Rendimiento y publicación

El sitio no tiene paso de compilación, así que parte de la optimización depende del hosting:

- **Compresión y protocolo:** activar Brotli o gzip y HTTP/2 (o HTTP/3). La página pide unas 60 cosas
  (22 hojas de CSS, 24 módulos de JS, imágenes); con HTTP/2 viajan en paralelo y con HTTP/1.1 no.
- **Caché:** `images/`, `fonts/` y `vendor/` pueden llevar `Cache-Control: public, max-age=31536000, immutable`
  **siempre que un archivo cuyo contenido cambie también cambie de nombre** (por eso los logos son `logo-600.webp` y
  no `logo.webp`). `index.html` debe ir sin caché larga (`no-cache`). `css/` y `js/` conservan su nombre, así que
  mejor una caché corta (`max-age=3600`).
- **`modulepreload`:** `index.html` precarga los módulos de `js/` en paralelo. Si se agrega o renombra un módulo,
  actualizar esa lista (si falta, solo se pierde esta mejora, no se rompe nada).
- **Imágenes:** las del slider tienen versión de 800 px (`-800.webp`) y completa; el hero tiene versión
  vertical para celular (`hero-movil-*.webp`). Al cambiar una foto, regenerar todas sus versiones.
- **Medir:** el arranque deja marcas `ff:*` en el panel Performance de DevTools (`ff:reveals`, `ff:refresh`, ...).

