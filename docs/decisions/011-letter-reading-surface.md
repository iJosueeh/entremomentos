# ADR 011 — Carta reversible con superficie de lectura modal

Estado: implementado; aceptación visual pendiente. Actualiza la interacción de ADR 007 y los estilos de carta de ADR 010, sin modificar Story V2 ni los documentos narrativos.

## Diagnóstico

El sobre compartido medía hasta 24rem con proporción 1.6; el papel hasta 42rem, padding de hasta 3.5rem y texto de 1.4–1.8rem. La mejora compartida superponía el papel con `margin-top: -4rem` (`-2rem` en móvil). El CSS local añadía dos filas (sobre + lectura de hasta 70svh/44rem), conservando ese margen negativo. La altura total dependía de dos composiciones incompatibles. El artículo entero tenía overflow y el cierre sticky pertenecía al mismo contenido desplazable.

El movimiento anterior trasladaba el papel 72px desde su posición de lectura; no calculaba su origen en el sobre. No existían modalidad ni bloqueo de scroll exterior. Las escenas crean contextos con `isolation`; las animaciones pueden transformar ancestros. Un overlay fixed ordinario dentro de ellos no garantiza coordenadas del viewport.

## Composición y responsabilidades

LetterScene conserva un solo artículo y una copia del mensaje. Un dialog nativo inicialmente `open` lo presenta en flujo, sin modalidad, durante SSR/sin JavaScript. Si falta `showModal`, la mejora no se conecta y la lectura sigue disponible. Con mejora se cierra inicialmente; `showModal()` usa el top layer, independiente de transforms/clipping de ancestros, y aporta modalidad y navegación Tab nativa.

El sobre mide hasta 20rem con la misma proporción y geometría triangular. Permanece en flujo durante toda la interacción; no hay filas reservadas ni márgenes negativos. El diálogo mide hasta 38rem (608px con raíz de 16px), con 1rem de margen seguro por lado y altura máxima de `100dvh - 2rem`. El papel es flex vertical: cabecera no encogible con botón de al menos 44px y cuerpo con `min-height: 0` y overflow interno. Solo ese cuerpo hace scroll, contiene la firma y tiene foco/etiqueta para lectura con teclado. Texto fluido de 1.0625–1.25rem, interlineado 1.7 y padding de 1.25–2.5rem. La regla de tabindex de ESLint permanece en nivel error, con permiso para `region` solo en LetterScene: el cuerpo desplazable y etiquetado debe poder recibir Tab también en navegadores sin foco automático para scrollers. El CSS local conserva únicamente el énfasis final; la corrección de composición es compartida con la demo.

## Movimiento, foco y scroll

Se conserva un contexto GSAP y una timeline reproducible/invertible desde su progreso actual. Secuencia: sello y solapa, papel plegado que emerge desde el rectángulo real del sobre, expansión y centrado en la lectura. Se animan transform, opacidad, recorte de pliegue y atenuación del backdrop; no width/height/márgenes. El sobre permanece detrás como elemento secundario. Al cerrar se recorre la misma secuencia en sentido inverso.

Los rectángulos se miden en coordenadas del viewport con el diálogo ya abierto. Se invalidan valores al abrir desde cero; al redimensionar se recalculan y se asienta la intención actual para evitar una trayectoria obsoleta. Resize y visualViewport resize tienen limpieza propia. Movimiento reducido, cambios de preferencia o fallos de import conservan extremos estáticos operables. La pausa decorativa sigue siendo independiente.

El controlador guarda overflow/gutter inline y posición de página al abrir, bloquea el scroll exterior y reinicia el cuerpo de lectura. Mantiene el diálogo abierto durante la reversión. Botón, Escape y `cancel` solicitan cierre; se evita el cierre nativo inmediato para completar el regreso. Solo al terminar se cierra el diálogo y se restauran estilos, foco al sobre y posición exacta. Un cierre nativo externo también libera el bloqueo. Desmontar limpia listeners, contexto y modalidad, libera scroll y restaura SSR. No se añaden listeners de wheel/touch ni captura manual de Tab.

La impresión elimina restricciones, transform y clip-path para conservar el mensaje completo, incluso si estaba cerrado. No cambia la ruta dev-only ni su exclusión de producción.

## Evidencia y límites

Pruebas SSR comprueban contenido único, estructura cabecera/cuerpo, botones ocultos sin mejora y ambos consumidores. Dobles DOM comprueban estados, foco al acabar, bloqueo/restauración, cancel, cierre externo, resize, aperturas repetidas, reducción de movimiento, fallos y limpieza. GSAP real sobre objetos numéricos comprueba reversión, extremos, origen medido y recálculo. No sustituyen navegador, layout real ni lector de pantalla; véase [QA de carta](../qa/letter-refinement.md).
