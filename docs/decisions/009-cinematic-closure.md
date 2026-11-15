# ADR 009 — Epílogo full-bleed y cierre cinematográfico

Estado: implementado; QA visual pendiente. Continúa ADR 008 sin cambiar Story V2 ni dependencias.

## Causa y composición

La excepción anterior del epílogo eliminaba max-width, pero no el width de `.story-player > *`. Por eso el fondo absoluto seguía limitado al ancho de lectura. Además había un gradiente radial sobre la propia sección, fuera de la máscara del ambiente, que acentuaba el borde. No era una transformación GSAP.

EpilogueScene ocupa 100% del host ya full-width. SceneAtmosphere y epilogue-content son hermanos: el primero posee el cielo a ancho completo y el segundo conserva máximo 72rem y márgenes de página; la constelación mantiene 48rem y el texto 40rem. Se elimina el radial redundante de la sección. Las máscaras ambientales disuelven la luz al fondo transparente del documento. No hay 100vw, offsets, márgenes negativos ni clipping del contenido.

## Movimiento

Se amplía el creador existente, dentro del mismo matchMedia decorativo: paths normalizados con pathLength=1, dashoffset 1→0, duración por línea 1 y separación 0.12 entre líneas. Siete círculos reciben opacidad 0.25→1, duración 0.4 y separación 0.08 desde tiempo 0.2. Son unidades de timeline vinculadas al progreso de scroll, no una reproducción autónoma. Se conservan scrub 0.5, top 85%→center 45%, sin pin, bucles ni movimiento del texto.

Pausa/reducción revierten el contexto y restauran la constelación completa; Volver al comienzo sigue siendo un enlace nativo. Resize/fuentes/imágenes usan observePlayerLayout y refrescan solo los triggers propios. No se añade un listener o contexto paralelo.

## Footer

BaseLayout admite un slot footer con el pie anterior como fallback. La ruta demo compone la nota de ficción y un único footer en demo-closure, fuera de la isla React. Un gradiente CSS transparente→Midnight con 12% de Nebula prolonga el cierre cromático; no hay un trigger que controle el footer ni importaciones entre feature y layout. Se retira solo en esa ruta la línea superior del footer. La nota tiene margen cero y padding acotado; se elimina el mínimo 90svh del epílogo y se reduce el padding inferior para evitar un vacío obligatorio. El contenido conserva altura natural.

## Skills y evidencia

Se comprobó la presencia de design-taste-frontend, ui-ux-pro-max, impeccable, motion-director, gsap y systematic-debugging en `.agents/skills`. Se aplican jerarquía y continuidad cromática, separación de planos, diagnóstico antes de editar, movimiento reversible y reducción. Las referencias locales ya consultadas en esta sesión y craft floor guían la corrección; no se instala un motor ni se cambia la identidad. [Staggers de GSAP](https://gsap.com/resources/getting-started/Staggers/) documenta la API utilizada.

La suite cubre propiedad/refresh/limpieza, pausa/reducción, SSR de la composición, un solo footer y una prueba GSAP real sobre objetos numéricos de coordinación, avance/retroceso y reversión. No prueba SVG pintado, contraste real, continuidad física ni responsive. Ver verification para resultados y escenarios pendientes. No se puntúa suavidad o rendimiento sin navegador.
