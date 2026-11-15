# ADR 002 — Universo Vivo, landing M1

Estado: implementado; validación visual y de rendimiento en dispositivo pendiente.

## Dirección y alcance

Celestial Nostalgia evoluciona a un universo editorial de recuerdos suspendidos. Se conservan Midnight, Nebula, Lavender, Blush, Ivory y las fuentes Cormorant Garamond / DM Sans. Hero con título central, CTA a `/demo` y tres polaroids periféricas; sección narrativa con una composición de ejemplo y cierre pausado. No hay creación, editor, almacenamiento, API ni escenas completas del Story Player.

Se informó esta propuesta antes de editar. Las recetas genéricas de design-taste-frontend que cambian la paleta, prohíben flotación/escenas o añaden un kit de página completo ceden al brief y a la arquitectura existente. Se aplican sus criterios de jerarquía, fotografía real, límites de efectos y rendimiento. También se consultaron ui-ux-pro-max, impeccable, motion-director, gsap y ponytail. El motor de contexto/detector de Impeccable no pudo descargarse; se leyeron arquitectura, diseño y craft-floor directamente. No se afirman gates visuales de skills aprobados.

## Decisión técnica

Una feature `landing` con una isla React SSR + client:load permite controlar pausa y limpieza mediante hooks, siguiendo el patrón existente. Las rutas solo componen. No se añade ninguna dependencia ni se cambia Story Player. No se usa Three.js, smooth scrolling, canvas o WebGL: gradientes estáticos y 54 estrellas DOM, distribuidas en tres capas de movimiento independiente, bastan para el efecto solicitado.

GSAP posee entrada, flotación, atmósfera, reveals y parallax. CSS posee composición, rotaciones estáticas y feedback de botones; wrappers separados evitan competir por transform. `gsap.matchMedia` crea contextos propios con reversión de estilos y ScrollTriggers. Imports tardíos se descartan al desmontar. Los listeners de puntero, resize, scroll y visibilidad se eliminan y el observer se desconecta. Nunca se borran triggers globales.

Pausa manual y movimiento reducido ofrecen la composición estática completa. La animación ambiental se detiene fuera de pantalla y con pestaña oculta. No se retrasa el foco ni se bloquea el scroll. Documentación primaria consultada: [GSAP matchMedia](<https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>).

## Imágenes y rendimiento

La descarga nueva de stock falló por DNS. Se utilizaron tres paisajes disponibles en el catálogo local de la skill, con procedencia y licencia en `public/images/credits.json` y créditos visibles. No son fotos personales. Se conservaron los colores; redimensionado a 640px y compresión WebP con sharp ya transitivo de Astro. Total aproximado 174 KiB frente a 940 KiB de originales, que no se distribuyen. La segunda imagen de bosque reutiliza el recurso y carga con lazy. No se incorpora una dependencia directa para procesarlas.

El contenido se genera en HTML incluso sin JS. La carga de GSAP es dinámica; hay coste de hidratación React, compartido con la integración existente. No se confunden tamaño de artefactos con transferencia real ni con métricas de fluidez. Solo opacity/transform animados, sin blur/filtros dinámicos. Las fuentes externas conservan fallbacks locales.

## Verificación

Ver `docs/verification.md`: comandos, resultados, peer previo de tooling y límites de navegador. Revisión independiente de código solicitada por el flujo de Impeccable; sin evidencia visual no equivale a aprobar dirección artística renderizada. No se crearon commits ni push.
