# LetterScene — Refinamiento de lectura y movimiento

Fecha: 2026-11-15. Implementación compartida para `/demo` y `/para/danna/`. Texto aprobado, Story V2, página demo y documento ficticio conservados mediante SHA-256 antes/después. Sin commits, push, publicación ni dependencias nuevas.

## Diagnóstico y cambio

Se retiró la combinación de grid local de dos filas, margen negativo compartido y scroll del artículo completo. El botón sticky podía ocupar la misma zona visual que los párrafos. La trayectoria previa no partía del sobre. El detalle de dimensiones, stacking, overflow y solución está en [ADR 011](../decisions/011-letter-reading-surface.md).

Ahora el sobre permanece centrado en flujo. El papel usa un diálogo en el top layer con márgenes seguros, ancho máximo de 608px y altura disponible del viewport. La cabecera conserva el cierre y el cuerpo desplaza únicamente el mensaje. El fondo se atenúa y la misma timeline invierte solapa, salida, expansión y regreso. La modalidad y el bloqueo de scroll duran hasta terminar el cierre; se restauran foco, overflow/gutter originales y posición de página. Sin JS se muestra la carta completa; movimiento reducido abre/cierra inmediatamente.

## Evidencia automatizada

- Vitest: 15 archivos, 157 pruebas aprobadas. Incluye SSR de ambas historias y carta larga, contenido único, estructura del cierre fuera del cuerpo, estados/interrupciones, Escape/cancel, restauración de foco y scroll, cierre externo, tres ciclos consecutivos, cambio de viewport, preferencias y limpieza. Los eventos DOM se simulan: no certifican layout, Tab nativo ni scroll real.
- GSAP real sobre objetos numéricos: reversión sin salto de progreso, retorno al extremo inicial, origen calculado del sobre y actualización tras cambiar rectángulos. No prueba representación 3D, clipping ni fluidez.
- Astro check: 80 archivos, cero errores/warnings/hints.
- Gate completo: ver resultado actual en [verificación](../verification.md).
- SHA-256: `sha256sum --check /tmp/entremomentos-letter-preserved.sha256`, cuatro archivos OK (historia local, schema, ruta demo, demoStory).

## QA visual pendiente

Se intentó arrancar `npm run dev -- --host 127.0.0.1`: código 1 antes de ready, log `/tmp/entremomentos-letter-dev.log`. Edge headless terminó con código 133 y `setsockopt: Operation not permitted`, log `/tmp/letter-browser-probe.log`. Firefox headless también falló con código 139, log `/tmp/entremomentos-letter-firefox.log`. Ninguno produjo una captura válida. No se declara validadas la apariencia, proporción, ausencia de overflow/clipping, rutas HTTP, lectura con tecnología asistiva ni interacción real.

Ejecutar localmente `npm run dev -- --host 127.0.0.1` y repetir en ambas rutas:

| Viewport   | Zoom        | Revisión pendiente                                                                        |
| ---------- | ----------- | ----------------------------------------------------------------------------------------- |
| 320 × 568  | 100% y 200% | Cierre siempre alcanzable, márgenes seguros, lectura hasta firma, sin overflow horizontal |
| 390 × 844  | 100% y 200% | Sobre, pliegue, apertura, scroll interno y vuelta al mismo punto                          |
| 768 × 1024 | 100% y 200% | Centrado, cabecera separada y resize durante apertura/cierre                              |
| 1440 × 900 | 100% y 200% | Ancho de lectura, profundidad, atenuación y trayectoria coherente                         |

En cada tamaño: abrir por Enter y Space; recorrer con Tab/Shift+Tab; enfocar el cuerpo y leer con flechas/PageDown hasta la firma; comprobar que fondo/página no se desplazan con wheel, touch o teclado mientras está abierta. Cerrar con botón y Escape, comprobar foco visible en el sobre y posición de página restaurada. Repetir al menos diez ciclos y solicitar cierre durante apertura. Probar reducción de movimiento inicial y cambios en vivo; la pausa decorativa no debe cerrar la carta. Verificar sin JS y con vista de impresión. Probar también zoom/reflow con fuente alternativa sin red y navegación entre las seis escenas tras cerrar.

La exclusión de la historia local del build se mantiene con `scripts/check-story-build.mjs`, integrado en `npm run verify`; el CSS compartido de LetterScene sí se distribuye para la demo. No exponer el servidor de desarrollo.
