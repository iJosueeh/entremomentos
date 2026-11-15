# Celestial Nostalgia

## Story Player — M2.1: Un universo que recuerda

El player conserva los tokens comunes y usa CSS acotado a `.story-player`, sin importar estilos o componentes de la landing. Intro y Connection forman una apertura celestial continua. El cielo tiene 32 estrellas fijas, tres destellos geométricos y profundidad radial cálida/fría; no hay parpadeo, vídeo, WebGL, filtros animados ni nuevas imágenes. Memories incorpora la galería de M2.2 descrita abajo; Discovery, Letter y Epilogue incorporan las interacciones de M2.3 descritas abajo.

La navegación es una lista de anclas de 44px mínimo, Blush sobre Midnight, con subrayado para la escena activa; no usa números, indicadores luminosos o una barra fija sobre el texto. Los títulos de destino tienen scroll-margin y foco visible. La pausa decorativa es un control textual secundario, independiente de la preferencia del dispositivo; su espacio se reserva antes de hidratar. Sin JavaScript permanece oculta y toda la narrativa visible.

Intro centra la luz, el título, el mensaje documental y una invitación nativa. La luz emerge en 1.1s y el título se asienta en 0.8s desde 12px y opacidad 0.78: nunca deja de ser legible, los párrafos y la acción no esperan. La luz se desplaza 64px al abandonar la escena con scrub 0.5. La entrada ocurre una vez por escena montada y se omite si Intro ya está fuera de pantalla.

Connection dispone texto y constelación en dos columnas desde 768px; en móvil el texto precede al diagrama. Dos luces cálida/fría se aproximan, después se dibujan las conexiones y aparecen nodos e iluminación. Un timeline de scrub 0.5 sigue la propia región visual, de top 85% a center 45%, incluso con párrafos largos. Los párrafos permanecen quietos. Una línea descendente se disuelve hacia Memories sin añadirle coreografía.

La apertura y la galería ocupan hasta 72rem; Discovery y Letter conservan 46rem; el epílogo expande la geometría hasta 72rem con lectura de 40rem. Las alturas son mínimas y crecen con el contenido; solo el cielo decorativo usa overflow: clip. En modo estático, pausa o movimiento reducido, ambas luces y toda la constelación quedan completas. Sin pin, scroll capturado ni bucles ambientales. Fuentes y fallbacks existentes conservados. Fotos opcionales, lazy y con dimensiones reales; créditos al pie de cada foto. Pendiente revisar contraste renderizado, foco, composición y movimiento en navegador.

Dirección: editorial íntima y nocturna. M1 expande Celestial Nostalgia a Universo Vivo: título central, recuerdos suspendidos y luz periférica. El foco es el mensaje y una acción real, Explorar la demo. Las fotografías son paisajes de stock identificados como ejemplos; las frases ilustrativas no son testimonios.

## Tokens

Fuente de verdad: `src/styles/global.css` (`@theme` de Tailwind 4 y variables semánticas).

| Token      | Valor / propósito                     |
| ---------- | ------------------------------------- |
| Midnight   | #101426, fondo                        |
| Nebula     | #252143, profundidad                  |
| Lavender   | #A98BD6, acento y foco                |
| Blush      | #E9C5B8, texto secundario y énfasis   |
| Ivory      | #F5EBDC, texto y controles            |
| Display    | Cormorant Garamond, Georgia, serif    |
| Sans       | DM Sans, system-ui, sans-serif        |
| Espaciados | 0.5, 1, 1.5, 2, 3, 5 rem              |
| Bordes     | 1px, Ivory al 24%                     |
| Radio      | 999px en controles                    |
| Sombra     | halo decorativo con acento al 25%     |
| Capas      | decoración 0, contenido 1, salto 10   |
| Feedback   | 180ms, cubic-bezier(0.2, 0.7, 0.3, 1) |

El movimiento GSAP tiene su fuente de verdad en `animations/motion.ts`: entrada 0.9s/24px/power2.out; scroll 64px con scrub de 0.5s. No duplicar estos valores en componentes.

## Accesibilidad y responsive

Diseño mobile-first, contenedor fluido, títulos con clamp y quiebre de cabecera en pantallas estrechas. Controles de al menos 44px; foco visible, enlace de salto y landmarks. Usar texto Ivory o Blush sobre Midnight; comprobar contraste ante nuevos fondos o temas. No comunicar estado solo por color.

Movimiento reducido elimina transiciones CSS y evita crear animaciones/ScrollTriggers; los cambios de preferencia revierten las animaciones existentes. Sin JS el contenido está visible. Google Fonts utiliza display=swap y fallbacks locales; considerar fuentes autoalojadas al optimizar producción.

Antes de cerrar M0 revisar 320, 390, 768, 1024 y 1440px; teclado, zoom 200%, reducción de movimiento, lectura sin JS y contraste. No se declara esta revisión completada sin navegador.

## Universo Vivo — M1

La paleta y las familias editoriales anteriores permanecen. `landing.css` define `--universe-line` (Lavender al 19%), `--universe-paper` (Ivory) y `--universe-ink` (Midnight). CTA Blush sobre Midnight; énfasis editorial Blush, sin texto en degradado. Polaroids Ivory, sombras con profundidad y fotografías a color. No se aplican filtros de color ni blur animado.

Composición móvil: mensaje, CTA y collage en filas del documento, para admitir texto mayor y fuentes fallback. Desde 768px los recuerdos ocupan órbitas periféricas. Bordes de lectura comunes y una segunda sección más quieta; imágenes con dimensiones/aspect ratio y sin interacción falsa. Créditos y datos de ejemplo explícitos.

Movimiento de la landing: fuente de verdad `src/features/landing/animations/motion.ts`. Entrada 1.15s, 22px, power3.out y stagger 0.13s; fotos después del texto con un solapamiento suave. Flotación de 9px en ciclos de 6.5/8.2/9.9s; estrellas en tres capas con ciclos diferentes de 24/31/38s. Nebulosas con desplazamiento máximo de 16px y gradientes radiales estáticos. Revelados únicos al 90% del viewport, sin pin ni scrub. Parallax de amplitud 8/12/20px, suavizado de 0.9s, solo hover/fine. No se sincronizan todos los recuerdos ni se parpadean estrellas.

El control Pausar movimiento restaura el estado estático y evita crear animaciones. Movimiento reducido revierte estilos y triggers, elimina el control innecesario y conserva contenido y acciones. Las preferencias se siguen en vivo mediante GSAP matchMedia. La hidratación no determina la visibilidad del HTML inicial. Pendiente validar composición y contraste renderizados en navegador; no se infiere suavidad a partir del build.

## M1.1 — Un recuerdo encuentra su universo

Paleta y hero conservados. El bosque conecta hero, recuerdo, constelación de cinco nodos y carta Ivory. El proxy usa scroll directo para estabilidad de geometría; nodos/conexiones usan scrub 0.5s. Un único pin de 0.65 viewport solo desde 1024×720; móvil usa composición vertical con vuelo reversible y conexiones, sin pin. Cuatro actos legibles estáticos con reduced motion/sin JS. Carta anima texto separado del anclaje. Revisión visual pendiente.

## Story Player — M2.2: Recuerdos que cobran vida

Memories conserva la paleta y las fuentes. Cabecera de 46rem y galería de 72rem; filas con imagen dominante y texto íntimo, alternas desde 48rem y apiladas en móvil. Separación entre recuerdos de 4–10rem, sin tarjetas ni alturas fijas. Fecha en español, título y mensaje permanecen estáticos. Los recuerdos sin fotografía usan una composición de lectura con líneas sutiles, sin hueco fotográfico.

La foto gana presencia con scroll desde opacidad 0.78 y escala 0.985, mientras su interior deriva ±1.5% a escala 1.04. Parámetros en playerMotion.memories; scrub 0.5, figura estable como trigger y sin pin. Zoom de hover 1.025 solo en hover/fine; pausa y reduced motion conservan fotografías completas y quietas. Los créditos nunca se animan.

Ampliar permanece visible sobre una base Midnight opaca de 44px mínimo. El foco Lavender se dibuja fuera del enlace sin recortarlo. Un dialog opcional muestra foto sin recorte, título, mensaje y atribución, con cierre visible y Escape. Conserva el punto de lectura y devuelve el foco; el scroll interno permite texto largo y zoom. Sin JavaScript el enlace abre el recurso de imagen. No hay transición que retrase foco o cierre. Pendiente revisar responsive, top layer, teclado real, contraste y movimiento en navegador. Ver ADR 006.

## Story Player — M2.3: Los recuerdos que permanecen

Discovery presenta los párrafos completos con tipografía editorial y aire. Un details nativo «Seguir el hilo de los recuerdos» descubre títulos conectados por una línea fina y nodos. Los enlaces regresan al recuerdo correspondiente; no hay otra ampliación de fotografías ni texto narrativo bloqueado por interacción.

La carta es el momento principal: papel Ivory, tinta Midnight, pliegues Blush/Ivory y sello celestial geométrico. Un sobre de hasta 24rem cede el protagonismo al papel de hasta 42rem. El papel permanece en el flujo, sin altura máxima, clipping ni scroll interno, y admite párrafos de 4000 caracteres, palabras largas y firmas de 120 caracteres. En móvil se reduce padding y solapamiento; los controles mantienen 44px. Foco y selección de texto usan tinta oscura sobre papel claro. Sin JavaScript se lee directamente el papel, con mensaje y firma únicos.

playerMotion.letter concentra la secuencia: solapa 0.32s con giro −180°, sello 0.12s, sobre que cede 12px/escala 0.96 y papel que asciende 72px desde escala 0.94 durante 0.54s, empezando en 0.16s. Duración total 0.70s, power2.inOut; cierre a velocidad 1.2 (aprox. 0.58s desde abierto). Todo el mensaje aparece junto, sin escribir letras ni escalonar párrafos. Cada nueva intención reproduce o invierte el progreso actual. Cerrar restaura solapa, sello y sobre; el papel se oculta al llegar al extremo cerrado. No hay espera para teclado ni bloqueo de scroll. La pausa decorativa no afecta a esta acción explícita.

Con reducción de movimiento, apertura/cierre son inmediatos y el sobre usa extremos CSS estáticos. Cambiar la preferencia con la carta abierta mantiene lectura y foco, revierte los estilos GSAP y asienta el estado solicitado. Volver a habilitar movimiento no repite la apertura.

El epílogo dispone estrellas unidas, ecos de los primeros tres títulos de recuerdos y el cierre documental, con una única acción «Volver al comienzo». Los trazos normalizados y las estrellas siguen un scrub reversible de 0.5 entre top 85% y center 45% de su visual; texto y enlaces no se animan. En pausa/reducción/sin JS la constelación queda completa. No hay footer comercial ni publicación. La suavidad, oclusión del papel y responsive renderizado requieren comprobación real; no se aprueban por inspección de CSS o tests de objetos.
