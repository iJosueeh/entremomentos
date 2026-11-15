# ADR 006 — M2.2: Recuerdos que cobran vida

Estado: implementado; resultados y aceptación de navegador en [verification](../verification.md). Continúa ADR 004 y ADR 005. Alcance: MemoriesScene, ampliación opcional y coordinación de geometría del player.

## Composición

Modo Experience dentro de Celestial Nostalgia. Memories ocupa hasta 72rem y conserva una cabecera de lectura de 46rem. Los recuerdos con foto alternan texto e imagen desde 48rem; en móvil conservan una columna con texto antes de foto. Las otras tres escenas posteriores conservan su composición. No hay tarjetas, carrusel, pin ni acciones obligatorias para avanzar.

El array mantiene su orden editorial, sin ordenar por fecha. La fecha se presenta en español con UTC explícito. Fechas ISO, títulos, mensajes y fotografías permanecen en HTML antes de JavaScript. Se mantienen 1–100 recuerdos, imágenes opcionales y textos de longitud variable. Sin imagen hay una composición textual propia, sin placeholder ni trigger. StoryPhoto conserva alt, dimensiones, lazy, decoding async y créditos visibles. Se reutilizan las fotografías ilustrativas existentes. No cambian contrato V2, fixture ni API pública.

La ampliación y el ambiente se evolucionan en [ADR 008 — M2.2.1](008-visual-depth-photo-motion.md); el cierre inmediato descrito aquí corresponde a la implementación original.

## Exploración opcional

Cada foto tiene un enlace nativo a su recurso, nombre «Ampliar fotografía: título» y acción visible «Ampliar». Sin JavaScript, sin soporte de dialog o con modificadores se conserva la navegación nativa. La mejora abre un único dialog por galería; su imagen se monta al solicitarla, sin duplicar fotos en SSR.

El visor muestra título, foto completa, créditos y mensaje. showModal proporciona modalidad y contención de foco; Cerrar fotografía es el primer control. Escape y el botón cierran sin espera. useMemoryViewer posee selección, efecto y limpieza: guarda scroll y overflow, bloquea el desplazamiento del documento y restaura ambos y el foco al enlace con preventScroll. Cerrar no cambia hash ni escena. Desmontar o sustituir el documento invalida la selección y limpia el bloqueo. El visor funciona con pausa y movimiento reducido.

La ampliación usa foco protegido para explorar una foto; la lectura y el avance no requieren abrirla. Los créditos permanecen fuera del enlace de ampliación.

## Movimiento y propiedad

createMemoriesAnimation se compone en el matchMedia existente de createPlayerAnimation; parámetros en motion.ts. No se crea otro hook de preferencias, master timeline ni motor de escenas.

Cada foto tiene un timeline reversible con scrub 0.5, desde top 95% hasta bottom 15% de su figura estable. En el primer 35% gana presencia desde opacidad 0.78 y escala 0.985 hasta opacidad 1 y escala 1, con power2.out. En paralelo, el interior se desplaza entre −1.5% y +1.5%, con escala fija 1.04 para cubrir los bordes. Solo se animan transform y opacity. Textos, créditos y controles no reciben GSAP. El asentamiento de escala evita desplazar la foto sobre los créditos. Entrada, deriva y zoom de hover usan wrappers distintos para evitar escrituras simultáneas sobre una transformación.

El hover de 1.025 usa CSS, solo con hover/fine y movimiento permitido. Pausa y reduced motion revierten el contexto completo y muestran fotos estáticas sin recorte de movimiento. No hay bucles, autoplay, listeners de scroll ni mediciones por frame. El número de timelines depende de las fotos reales.

## Geometría y limpieza

observePlayerLayout sustituye el callback aislado de fonts.ready de M2.1. Coordina fonts.ready, load/error de imágenes en captura y ResizeObserver de la raíz. Agrupa avisos en un requestAnimationFrame y refresca exclusivamente los triggers propios de Intro, Connection y Memories. No espera toda la galería lazy para iniciar movimiento.

La limpieza desconecta el observer, retira listeners, cancela el frame y descarta callbacks tardíos. matchMedia ejecuta esa limpieza y restaura estilos, también al cambiar preferencias. El try/catch conserva reversión ante inicialización parcial fallida de una foto. No se refrescan ni eliminan triggers globalmente.

## Skills y verificación

Se aplicaron design-taste-frontend (jerarquía fotográfica y unidad), ui-ux-pro-max (consultas de foco, sensibilidad y efectos React), Impeccable (Experience, animate y craft floor), motion-director (continuidad y reducción), GSAP (propiedad y scrub) y Ponytail (reutilización).

Brief, créditos e identidad prevalecen sobre recetas comerciales incompatibles: se conservan Lavender, atribución y coreografía progresiva; no se importa un kit, sortea otra paleta ni añaden recursos. Impeccable context no pudo descargar el motor; se leyeron las referencias locales. No se declara detector ni gate visual aprobados.

Pruebas: SSR, enlaces nativos, visor cerrado sin duplicados, cantidades 1/12/100, propiedad GSAP, fallo parcial, refrescos agrupados y descarte tardío, scroll/foco/overflow, sustitución de documento y diez ciclos. Los harness y dobles prueban operaciones solicitadas; no foco real, top layer, reversión de estilos, hidratación o fluidez. La aceptación visual requiere navegador funcional; ver verification.

Referencias oficiales consultadas para GSAP 3.15.1: [matchMedia y revert](<https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>), [ScrollTrigger y scrub](https://gsap.com/docs/v3/Plugins/ScrollTrigger/).
