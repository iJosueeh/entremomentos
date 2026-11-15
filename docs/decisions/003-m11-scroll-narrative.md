# ADR 003 — M1.1: Un recuerdo encuentra su universo

Estado: implementación verificada por herramientas; aceptación visual pendiente.

Se conserva el hero Celestial Nostalgia y se añaden tres actos: bosque protagonista con anécdota; constelación de tres paisajes y dos notas; carta con CTA a la demo técnica existente. No se modifica Story Player ni se añaden dependencias, APIs, editor o persistencia.

## Presentación y propiedad

`Landing` compone `MemoryOrbit`, `StoryActs` y un proxy decorativo del bosque; `Polaroid` reutiliza datos locales existentes. Los cuatro anclajes del bosque están en HTML SSR y permanecen visibles sin JS/reduced motion. Con movimiento permitido, los originales conservan semántica pero tienen opacity cero; una sola representación aria-hidden viaja entre ellos, sin reparenting de React. Al navegar con teclado se restaura la presentación original. No hay acciones ocultas en las fotografías.

`create-story-animation.ts` mide centros, anchuras sin rotación y ángulos después de fuentes/decodificación; construye puntos en coordenadas de documento. `story-geometry.ts` interpola posiciones y tamaños de forma determinista, reversible y comprobable sin DOM. Las medidas solo se leen al refrescar, no en cada actualización de scroll. El proxy usa transform y su geometría sigue scroll directamente para coincidir con anclajes; conexiones/nodos usan scrub 0.5s. No se añade Flip. La entrada, el ambiente, el puntero y la coreografía poseen wrappers distintos.

Único pin: panel del recuerdo, ancho >=1024px y alto >=720px, duración 0.65 alturas de viewport. Incluye un tramo de posición constante en viewport en la trayectoria. En móvil/ventanas bajas hay viaje continuo del bosque, nodos y conexiones reversibles, sin pin; constelación en flujo vertical. El ancestro del pin no recorta ni anima transform. La carta anima solo su texto para mantener estable el último anclaje.

## Ciclo de vida y accesibilidad

GSAP matchMedia revierte contextos propios al cambiar preferencias/breakpoint. Hook descarta imports tardíos, espera fuentes e imágenes y limpia contexto, pin, listeners y tweens. Pausa restaura la composición estática; para conservar lectura se mide el panel visible del acto fijado o la sección en los otros actos antes/después de la operación. Control fijo accesible durante el recorrido, oculto sin JS y con reduced motion. No hay animación obligatoria para leer contenido ni abrir la demo. Ambiente se detiene fuera del hero o con pestaña oculta; el parallax se neutraliza tras el inicio del hero.

## Recursos y límites

Misma fotografía de bosque, variante 1280px del original local con licencia CC BY 2.0; manifiesto de procedencia actualizado y URL visible Wikimedia corregida a jpg. No se presentan recuerdos personales ni testimonios. Compresión WebP; nitidez y percepción de compresión pendientes de inspección visual.

Skills aplicadas: design-taste-frontend, ui-ux-pro-max, impeccable, motion-director y gsap. Se respetó el brief frente a recetas de identidad genéricas. Contexto/detector Impeccable no disponibles por fallo de descarga del motor; referencias y documentos leídos directamente. Revisión independiente de código identificó y permitió corregir clipping por orden CSS, desplazamiento del anclaje de carta y referencia de lectura durante pausa dentro del pin.

Los tests matemáticos no demuestran continuidad perceptiva del navegador. Véase verificación: no hay capturas válidas ni aprobación de portafolio.
