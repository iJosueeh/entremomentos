# ADR 008 — M2.2.1: profundidad ambiental y continuidad fotográfica

Estado: implementado; resultados y límites en [verification](../verification.md). Amplía ADR 004–006 sin cambiar Story V2, la API pública ni las dependencias. Esta copia ya contenía M2.3 (ADR 007): se conservan sus interacciones sin desarrollar otras nuevas.

## Diagnóstico

`useMemoryViewer` montaba una segunda imagen al seleccionar el recuerdo y llamaba a `showModal()` en un efecto posterior al render. La fotografía aparecía directamente en su geometría final; no había captura de origen, proxy, timeline funcional ni estado de salida. Cerrar borraba la selección inmediatamente. El backdrop era opaco desde el primer fotograma. Una transición CSS sobre el diálogo no conserva la relación espacial con la foto de la galería.

Además, el origen ya está recortado por `.story-player__photo-window`, con escala/deriva GSAP en wrappers y zoom CSS de hover. El visor anterior aplicaba `width: 100%`, `max-height` y `object-fit: contain`: el rectángulo del elemento podía incluir espacio ajeno a la imagen en fotografías verticales. La nueva imagen usa ambas dimensiones automáticas y límites máximos; su caja conserva la proporción real.

## Decisión: FLIP manual con GSAP existente

Se evaluó GSAP Flip, incluido en GSAP 3.15.1: resulta útil al intercambiar layouts o reubicar múltiples elementos, y puede emparejar elementos diferentes. Aquí solo viaja una fotografía entre un recorte animado y el top layer nativo; aun usando Flip habría que calcular el recorte, asegurar la decodificación y conservar el ciclo modal. Se elige FLIP manual: dos medidas, un proxy y una escala uniforme, sin plugin adicional ni reparentar nodos que React posee.

`photo-geometry` calcula posición, escala y los cuatro insets del recorte. `createPhotoAnimation` conserva un clon decorativo dentro del diálogo, lo sitúa sobre el origen medido y anima transform, opacity y clip-path hacia la caja del destino. Clip-path es una excepción acotada a una sola imagen; no hay blur ni medición de layout por fotograma. La opacidad del wrapper original también se conserva. El proxy nunca recibe foco ni alt narrativo; al asentarse se muestra la imagen semántica real.

La coreografía dura **560 ms**, `power2.inOut`, con oscurecimiento paralelo mediante una capa real dentro del top layer. El backdrop nativo permanece transparente: no se depende de animar un pseudo-elemento o de su herencia de variables. No hay un panel opaco que aparezca antes que la fotografía.

La inversión usa la última intención: se retira la timeline anterior y se interpola desde los valores actuales hasta el extremo solicitado, sin volver al primer fotograma. Se reevalúa el origen al cerrar. Resize, visualViewport, fuentes, scroll interno del visor y ResizeObserver de la foto agrupan ajustes en un frame; durante una transición se redirige desde la posición actual, y una foto ya abierta conserva su layout nativo. El proxy se vuelve a alinear con esa caja antes de cerrar.

## Ciclo de vida y accesibilidad

- `useMemoryViewer` conserva selección React y monta `connectMemoryViewer` en un layout effect, para preparar el diálogo antes de mostrar la imagen final. La selección permanece hasta terminar el cierre.
- El controlador posee modalidad, listeners, decodificación, import dinámico, reducción y descarte de generaciones. El botón de cierre recibe foco inmediatamente con preventScroll. `showModal()` proporciona inert y contención nativa de Tab; no se duplica un focus trap.
- El evento nativo cancel de Escape evita el cierre inmediato y solicita la salida. Botón, Escape repetido y cierre nativo inesperado son idempotentes. Al terminar se restaura foco, overflow previo y posición de lectura. No se cambia hash ni escena.
- El gutter se reserva en documentos que contienen el player, antes de bloquear overflow, para conservar el ancho de la galería. El visor respeta safe areas, poca altura y scroll interno de textos/créditos largos.
- Reduced motion inicial no importa GSAP ni produce movimiento espacial. Activarlo durante una transición revierte los estilos y asienta la intención. Volver a permitirlo con el visor abierto no reproduce una entrada. La pausa decorativa nunca bloquea la interacción funcional.
- Mientras se esperan import/decodificación, el destino y el oscurecimiento permanecen transparentes; el cierre sigue disponible. Cerrar o desmontar invalida ambas promesas. Si falla GSAP/decodificación/geometría, queda el visor estático accesible. Sin soporte de dialog, sin JS o con modificadores se mantiene el enlace nativo.
- La foto solicitada usa carga eager, para que la decodificación no dependa de la elegibilidad lazy de un diálogo todavía transparente; la galería conserva lazy. Durante preparación el contenido invisible es inert y el botón de cierre sigue disponible.
- Desmontar, sustituir el array documental o recibir un close nativo retira listeners, observer, frame, proxy y contexto propios. No se matan ni refrescan recursos GSAP globalmente.

## Atmósferas de las seis escenas

Modo Experience: se mantiene Celestial Nostalgia, los textos, las fuentes y los créditos. Los datos documentales no conocen efectos, posiciones, selectores ni recursos nuevos.

| Escena             | Plano ambiental                                                                                                                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Intro / Connection | OpeningSky determinista, nebulosas CSS inclinadas, luz Blush y Lavender sobre Midnight. El mismo cielo acompaña el encuentro.                                                                                                                     |
| Memories           | Paisaje velado tomado de la primera fotografía disponible del documento, con luces laterales y máscara de disolución. Reutiliza la fuente de la fotografía y sus créditos narrativos; sin imagen permanece una atmósfera de luz, sin placeholder. |
| Discovery          | Dos hojas translúcidas desplazadas, bordes de papel y sombra suave detrás del texto y del índice existente. No se añade un álbum interactivo.                                                                                                     |
| Letter             | Proyección cálida contenida detrás del sobre y el papel Ivory existentes. El mensaje sigue siendo el centro.                                                                                                                                      |
| Epilogue           | Retorno al mismo cielo estrellado y luz fría, detrás de la constelación existente.                                                                                                                                                                |

`SceneAtmosphere` concentra las capas compartidas. Solo la luz se desplaza ±16px y cambia presencia 0.65→1; el texto, papel, fotos ambientales y controles no se desplazan con el scroll. `createAtmosphereAnimation` se compone dentro del matchMedia decorativo existente, con scrub 0.5 de top bottom a bottom top, reversible y sin pin, bucles ni listeners de scroll propios. Las capas no capturan puntero, son aria-hidden y recortan únicamente su decoración. Pausa/reducción revierten al estado estático completo; los triggers se refrescan y revierten junto con los recursos existentes.

No se añaden recursos fotográficos, dependencias, servicios, canvas, WebGL, ruido procedural ni blur. El paisaje reutiliza el mismo URL del documento; los WebP de la demo ya están optimizados. No se genera automáticamente una variante optimizada de URLs externas: esa responsabilidad sigue perteneciendo al productor del documento V2.

## Skills y criterios

Se aplicaron systematic-debugging (aislamiento antes de editar), design-taste-frontend (jerarquía, contención y fotografía), ui-ux-pro-max (consulta local de foco, reducción y exceso de movimiento), Impeccable (Experience, animate y craft floor), motion-director (propósito, interrupciones y verificación), GSAP (contextos y timelines) y Ponytail (reutilización y límites).

Prevalecen el brief y los ADR sobre recetas comerciales: se conserva Lavender, los créditos, el scroll nativo y las seis escenas; no se cambia la tipografía, no se sortea otra identidad ni se importa un kit/motor. Impeccable context falló al descargar su engine; se consultaron contexto y referencias locales. El checker de una landing comercial no constituye aceptación de esta superficie narrativa. No se declara gate visual aprobado.

Las pruebas distinguen SSR, dobles DOM y GSAP real sobre objetos numéricos. Cubren medidas/proporciones/recorte, apertura/cierre, interrupciones, Escape solicitado, foco solicitado, reducción, resize, import/decodificación tardíos, fallos y limpieza, además de reversión numérica del ambiente y regresiones previas. No demuestran foco nativo real, top layer, clipping pintado, fluidez física o rendimiento móvil. Ver [protocolo de navegador](../qa/m221-browser.md).

Referencias oficiales consultadas para GSAP 3.15.1: [Flip](https://gsap.com/docs/v3/Plugins/Flip/), [reverse](<https://gsap.com/docs/v3/GSAP/Timeline/reverse()/>), [context y revert](<https://gsap.com/docs/v3/GSAP/gsap.context()/>). La inversión manual redirige desde el estado actual en lugar de asumir que el layout permanece idéntico durante toda la sesión.

## Corrección posterior: clipping de MemoriesScene

La inspección de `/demo` identificó una limitación CSS de dos niveles: `BaseLayout` usaba `main.wrap` (hasta 72rem y márgenes de 1.5rem/3rem), y el artículo StoryPlayer repetía `max-width: 72rem`. Aunque Memories anulaba su propio máximo, su fondo absoluto con inset 0 seguía midiendo ese contenedor central. `overflow: clip` en SceneAtmosphere cortaba la decoración exactamente en esos bordes; la máscara vertical no disolvía sus laterales. Las filas editoriales compartían ese mismo ancho sin un margen interior independiente.

El recorte central no provenía de GSAP. Memories anima la presencia de un wrapper entre escala 0.985 y 1, y deriva/escala 1.04 en el interior de cada foto; el hover usa otra transformación. El overflow local de photo-window es intencional para cubrir esa deriva y se conserva. El clip-path del proxy solo pertenece a la ampliación. No había contain ni transformación del artículo que justificaran el borde ambiental. StoryActs, sus anclajes/pin y los estilos de Landing pertenecen a otra feature que no se compone en `/demo`; no se reutilizan ni se modifican.

Se introduce `fullWidthContent`, una opción de layout genérica y desactivada por defecto. La demo la activa para permitir que el artículo ocupe el ancho disponible del documento. El player distribuye el ancho de lectura entre sus hijos: conserva el máximo 72rem y los márgenes previos de 1.5rem/3rem para toolbar, apertura y escenas restantes. Solo Memories ocupa el 100% de su host.

Memories separa SceneAtmosphere, un nuevo `gallery-content` y el dialog como hermanos. El contenido conserva máximo 72rem, cabecera de 46rem y columnas editoriales alternas, con márgenes mínimos 1.5rem en móvil, 2rem desde 48rem y 4rem desde 64rem. Las pistas minmax(0, …), imágenes proporcionales y quiebres de texto existentes se mantienen. El fondo fotográfico ambiental recibe una máscara horizontal combinada con la vertical para disolver sus bordes. El clipping sigue restringido a la decoración y al interior de las fotografías.

No se utilizan 100vw, márgenes negativos, medición de viewport con JS, contain, transforms sobre el host ni overflow global para ocultar desbordamientos. Los porcentajes se resuelven contra el espacio real disponible, incluido el gutter del documento. Se conservan nodos/selectores GSAP y sus ancestros de trigger; los creadores, hooks y parámetros no cambian. Los resultados y los escenarios pendientes de navegador se registran en verification.

Skills aplicadas a la corrección: systematic-debugging y surgical-patch (causa y capa responsable), Impeccable/design-taste-frontend (separación de planos y márgenes), ui-ux-pro-max (consulta de overflow y texto largo), GSAP (propiedad y geometría de los wrappers) y Ponytail (cambio acotado). Se preserva la identidad y se descarta la receta genérica de ocultar overflow horizontal en la página.

## Corrección posterior: cielo compartido de Intro y Connection

Tras corregir Memories, la regla `.story-player > *` seguía aplicando ancho de lectura al wrapper `.story-player__opening`. OpeningSky es absoluto con inset 0 dentro de ese wrapper posicionado y aislado; su overflow clip y máscara vertical terminaban en los laterales del bloque central. Los gradientes transparentes superpuestos al fondo exterior hacían perceptible esa frontera: el origen es la geometría, no una paleta distinta que deba corregirse igualando colores.

Se exceptúa únicamente opening con width 100% del host ya liberado de main.wrap. Sus dos secciones reciben exactamente el ancho y márgenes que antes poseía su padre: min(72rem, 100% − dos márgenes de página). No se mueve el contenido, el diagrama, el título ni los nodos animados. El mismo cielo, sus estrellas y nebulosas cubren ambas escenas a ancho completo; no se crean dos fondos ni una unión de color entre escenas. Se mantienen isolation, z-index y clipping exclusivamente decorativo, sin transformación/contain nuevos sobre el host.

El cambio se limita a CSS y esta documentación. Memories y sus márgenes permanecen intactos. Discovery, Letter y Epilogue conservan sus planos actuales: no son hijos del wrapper de apertura. No se añaden 100vw, offsets laterales, márgenes negativos, listeners ni dependencias.

El trigger ambiental sigue siendo opening (ahora más ancho); los triggers de Intro y del diagrama Connection conservan sus nodos y geometría de lectura. observePlayerLayout ya observa la raíz con ResizeObserver y agrupa resize, fuentes e imágenes para refrescar los triggers propios, incluida la atmósfera; no se modifica ese mecanismo. La suite existente cubre ese refresco agrupado, descarte al limpiar, scroll reversible simulado, pausa y reducción. El renderizado y ScrollTrigger real a los cinco tamaños quedan pendientes si el navegador no arranca; ver verification.

Se aplican las mismas skills de depuración, parche acotado, diseño y GSAP de la corrección anterior. No se sustituye la identidad ni se añaden efectos.
