# ADR 007 — M2.3: Los recuerdos que permanecen

Estado: implementado; verificación integrada y límites visuales en [verification](../verification.md). Continúa ADR 004–006. M2.0, M2.1 y M2.2 se contrastaron con su código y pruebas antes de modificar; la galería M2.2 sí existe y su aceptación visual sigue pendiente.

La composición e interacción de LetterScene se actualizan en [ADR 011](011-letter-reading-surface.md); las decisiones de Discovery y Epilogue se conservan.

## Decisión

Evolucionar las tres escenas básicas dentro de story-player, conservando contrato Zod V2, API pública, paleta, tipografía y contenido documental. No se importa Landing, no se añaden dependencias ni se implementan servicios, editor o publicación.

Discovery mantiene toda su narrativa visible y ofrece un details nativo opcional que conecta los títulos de recuerdos mediante anclas. No exige abrir nada para avanzar y funciona sin JavaScript. Los destinos de Memories usan índices editoriales de la lista para admitir ids V2 arbitrarios sin fragmentos ambiguos. No se infieren afinidades ni se inventan detalles del relato.

Letter es una expansión en el flujo del documento, con un solo artículo para mensaje y firma. Se descarta el diálogo: leer la carta no necesita modalidad, contención de foco ni bloqueo de scroll. Sin JavaScript se muestra el papel completo y los controles de mejora están ocultos. Al montar, el hook habilita el sobre cerrado y sus controles. La narrativa no depende de concluir escenas anteriores.

Epilogue conecta estrellas en una geometría fija y muestra los primeros tres títulos de recuerdos como ecos editoriales, sin duplicar fotografías ni mensajes. El cierre documental y «Volver al comienzo» conservan sus datos y enlace nativo; no aparece un footer genérico.

## Carta: estado, interrupción y foco

useLetter posee ciclo de vida; connectLetter conecta DOM, intención y preferencias. createLetterAnimation posee GSAP; motion.ts concentra tiempos y desplazamientos. No hay motor genérico, estado global ni librería adicional.

Cuatro estados cliente: closed, opening, open, closing. Una intención booleana síncrona admite clics repetidos antes del siguiente render. Una timeline pausada orquesta sello, solapa, sobre y papel; play/reverse conservan el progreso en lugar de crear tweens competidores. Se resuelven explícitamente las inversiones que llegan exactamente a un extremo, donde GSAP puede no emitir otro callback. Completados obsoletos no ocultan una carta solicitada abierta.

El papel tiene altura natural y texto completo; no se duplican contenidos, no se usa texto tipeado ni se mide altura por frame. Abrir lo hace visible y enfocable inmediatamente, con preventScroll; al cerrar vuelve el foco al botón del sobre y el papel pasa a inert. Solo se oculta tras terminar la inversión. Botones nativos proporcionan Enter/Espacio y Tab conserva su recorrido normal. Escape cierra dentro de la región; no se captura globalmente ni afecta al visor de Memories.

La pausa decorativa del player no llega al hook de carta. Reduced motion tiene una suscripción propia porque esta acción explícita debe seguir operando cuando la decoración está pausada. Su cambio revierte el contexto y asienta la intención actual de forma inmediata, sin reenfocar ni cerrar una carta abierta. Volver a no-preference inicializa la timeline en ese extremo con callbacks suprimidos. Los cambios rápidos comparten el import pendiente y descartan generaciones obsoletas. Si GSAP falla, queda un disclosure inmediato funcional.

Al cambiar contenido o desmontar se retiran listeners, se descartan imports/callbacks tardíos y se revierte exclusivamente el contexto propio. Se restauran hidden/inert, etiquetas y estado estático legible. React conserva estructura y contenido constantes; el efecto posee exclusivamente atributos de interacción y GSAP sus estilos. No se borran animaciones/triggers globales.

## Epílogo y geometría

createEpilogueAnimation se compone en el matchMedia decorativo existente. Anima dos paths normalizados y opacidad de estrellas; scrub reversible y sin pin, texto quieto. El coordinador de layout de M2.2 refresca también su trigger ante resize, fuentes e imágenes. La expansión del papel cambia la altura de la raíz observada y el epílogo conserva geometría actualizada sin listener de scroll adicional.

## Skills y verificación

Ponytail para alcance y reutilización; Impeccable para Experience, animate y craft floor; Motion Director para propósito, interrupción, timing y reducción; GSAP para contexto/timeline; Feature Slicing para propiedad/imports internos. Se consultaron las recetas de Frontend Atlas y design-taste; la identidad y el brief prevalecen sobre paletas aleatorias, kits comerciales, nuevas fuentes e interacciones ajenas. El launcher Impeccable no descargó su motor: se leyeron documentación y referencias locales; no se afirma detector ni gate visual aprobado. No se delegó trabajo.

Las pruebas nuevas ejercitan estados, clics rápidos, cierres idempotentes, Escape, intención ante cambios de preferencias, fallos de carga, imports tardíos y diez limpiezas durante apertura. El controlador se prueba con dobles de eventos DOM; no demuestra activación nativa de Enter/Espacio ni foco real. Otras pruebas usan timelines reales GSAP sobre objetos numéricos para comprobar inversión parcial, ambos extremos y restauración de valores al revertir; no demuestran transformaciones CSS 3D ni renderizado. SSR comprueba carta única y legible, controles semánticos, narrativa larga y anclas. El test decorativo conserva los anteriores y verifica el epílogo sin pin ni animación textual.

La revisión visual, teclado real, hidratación, responsive, scroll real de ida/vuelta y suavidad física quedan pendientes ante fallos del navegador. No se puntúan categorías no observadas de la rúbrica Motion Director. Los detalles y logs están en verification.

Documentación oficial consultada para el runtime GSAP 3.15.1: [context y revert](<https://gsap.com/docs/v3/GSAP/gsap.context()/>). La consulta a la página reverse no fue accesible; los extremos y la inversión se contrastan además con el runtime instalado en las pruebas.
