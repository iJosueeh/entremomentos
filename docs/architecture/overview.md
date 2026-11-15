# Arquitectura M0 + M1 + M2.3

Astro genera HTML estático. La portada compone `Landing client:load`; `/demo` compone `StoryPlayer client:load`. Ambas islas incluyen contenido prerenderizado y son features independientes. El laboratorio M0 vive en `features/story-player/dev` y solo se registra en `/dev/gsap` durante `astro dev`.

## Responsabilidades y dependencias

- `pages` selecciona layout y compone la API pública de features.
- `components/layout` posee documento, metadatos y navegación; no importa features.
- `features/story-player/components` compone seis escenas semánticas, fotografías opcionales y navegación por anclas. El contenedor posee exclusivamente el estado local de pausa manual. Memories posee la selección opcional mediante useMemoryViewer y un dialog nativo. Un layout effect conecta connectMemoryViewer; el controlador conserva la selección hasta completar la salida, coordina decodificación/preferencias/resize y restaura overflow, scroll y foco al cerrar o sustituir el documento.
- `hooks` conecta la vida de React con preferencias del navegador; importa GSAP dinámicamente.
- `animations` encapsula registro, selectores acotados, tweens y ScrollTrigger. `motion.ts` concentra parámetros.
- `schemas` define contrato Zod y tipo inferido; no conoce React, Astro ni GSAP.
- `data` valida la muestra local al cargar. Datos futuros no confiables requerirán `safeParse` y presentación explícita de errores en la frontera de entrada.
- `features/story-player/styles` define presentación acotada al player; `src/styles` conserva los tokens y estilos comunes. Los estilos técnicos M0 se trasladan a `dev/styles`.

Dirección: páginas → API de feature → componentes → hooks → animaciones. Datos → schemas; componentes importan únicamente tipos del schema. Shared/layout no depende de features. Dentro de la feature se usan imports relativos; desde fuera se usan entradas públicas: `index.ts` para renderer y tipo Story, `document.ts` para Zod y fixture, `dev/index.ts` para el laboratorio. Separar la entrada documental evita empaquetar validación y datos de muestra junto al renderer del cliente.

## Límites del Story Player

V2 valida identidad, versión literal 2, tema, seis bloques de contenido y 0–100 recuerdos con fecha ISO real e identificadores únicos. Las fotografías son opcionales; cuando existen requieren fuente local absoluta o HTTPS, alt y dimensiones. El contrato no impone participantes ni roles románticos: permite amistad, pareja, familia y otros vínculos. Todos los tipos documentales se infieren desde Zod.

La API es `StoryPlayer({ story: Story })`. La fixture se valida antes del render. Futuros consumidores validarán entradas desconocidas con `safeParse` y resolverán errores fuera del renderer. El player no obtiene ni guarda documentos ni conoce Supabase, almacenamiento, editor o publicación. Vista previa y publicación entregarán el mismo contrato al mismo renderer; su UI externa no necesita un modo dentro del player.

Intro, Connection, Memories, Discovery, Letter y Epilogue permanecen en el DOM en orden fijo. Las escenas reciben su contenido correspondiente; Memories, Discovery y Epilogue reciben también el array editorial, sin reordenarlo por fecha. Una dedicatoria puede entregar `memories: []`: conserva las seis escenas y omite listas, índices y visor de recuerdos. Las fechas siguen siendo obligatorias cuando hay recuerdos. El contrato no almacena coordenadas, selectores ni parámetros GSAP. V1 permanece junto al laboratorio; no se convierte automáticamente porque carece de los textos narrativos de V2.

## Movimiento y limpieza

`useStoryMotion` sigue la preferencia del navegador y mantiene su resultado separado del estado de pausa manual. Solo carga GSAP cuando ambos permiten movimiento; los cambios rápidos comparten un import en curso por efecto y un contador descarta resultados obsoletos. Cambiar el documento, incluso manteniendo su id, reconstruye el efecto. Fallos de carga/inicialización conservan la lectura estática.

`createPlayerAnimation` crea un `gsap.matchMedia` acotado a la raíz y compone `createIntroAnimation`, `createConnectionAnimation`, `createMemoriesAnimation` y `createEpilogueAnimation`. Memories añade un timeline por fotografía sobre wrappers propios; los textos y créditos permanecen estáticos. Intro tiene una entrada de luz/título y un timeline de salida de la luz; Connection tiene un timeline reversible de luces, trazos, nodos e iluminación, con scrub 0.5 y sin pin. El texto siempre es legible: el título parte de opacidad 0.78, los párrafos no se animan. Un WeakSet impide repetir la entrada temporizada al reanudar; los enlaces profundos fuera de Intro la omiten. Pausar restaura la composición estática completa; nunca desconecta navegación ni elimina escenas. Reduced motion no cambia la elección de pausa manual. Cada efecto retira su listener y revierte su contexto, también ante inicialización parcial fallida. No se borran triggers globalmente.

`useStoryNavigation` observa las escenas en una franja central calculada en píxeles, actualiza únicamente la escena activa y reconstruye el observer al redimensionar. Retira observer y listener al desmontar, sin mover el foco por scroll. Las anclas son nativas; la navegación manual enfoca su título sin retrasar el scroll. Sin IntersectionObserver siguen funcionando todos los enlaces.

El HTML inicial contiene toda la narrativa. No hay decisiones de viewport ni APIs de navegador durante render. La pausa está oculta hasta la mejora cliente, con espacio reservado para su control. Las imágenes bajo Intro usan lazy, decoding async y dimensiones reales. observePlayerLayout agrupa fonts.ready, load/error de imágenes y ResizeObserver de la raíz en un frame cancelable. Refresca únicamente los triggers propios de la apertura, galería y epílogo, sin esperar todas las imágenes lazy. Al limpiar retira listeners/observer, cancela el frame y descarta callbacks tardíos.

`OpeningSky` presenta estrellas deterministas y profundidad; `ConnectionConstellation` presenta geometría SVG estática con identificadores derivados del id de escena. Ambos son decorativos y aria-hidden. La apertura usa el ancho disponible del layout (hasta 72rem); Memories también usa hasta 72rem con filas editoriales alternas; Discovery y Letter conservan 46rem de lectura; el epílogo usa 72rem para la constelación y 40rem para el texto. El CSS se acota al player y al wrapper de apertura, sin recortar foco ni contenido. Ver [ADR 005](../decisions/005-cinematic-opening.md) y [ADR 006](../decisions/006-living-memories.md).

## Profundidad y visor M2.2.1

La demo activa la opción genérica fullWidthContent de BaseLayout. El artículo puede llenar el host; los planos de lectura conservan sus anchos y márgenes anteriores. Opening ocupa el ancho del host y sus dos secciones poseen el límite de lectura, mientras el cielo compartido cubre ambas a ancho completo. Memories es la excepción a ancho completo: SceneAtmosphere y dialog quedan fuera de gallery-content, que posee el máximo editorial y los márgenes responsive. No se añade clipping al host ni se mide el viewport con JS. La nota de ficción conserva su propio wrap.

SceneAtmosphere concentra los planos decorativos de Memories, Discovery, Letter y Epilogue; OpeningSky conserva el cielo compartido de Intro/Connection y reaparece al final. Memories reutiliza la primera fotografía disponible del documento como paisaje velado, sin modificar datos/contrato ni añadir assets. createAtmosphereAnimation añade únicamente luz/transform y presencia a los recursos del matchMedia existente, con scrub reversible y refresh/limpieza propios.

La interacción fotográfica permanece separada de la pausa decorativa. createPhotoAnimation posee un proxy decorativo en el top layer y su contexto GSAP; photo-geometry mide dos rectángulos y calcula una única escala con recorte. Las inversiones y cambios de tamaño parten de los valores actuales. El controlador del hook mantiene modalidad, foco, intención, listeners, observers y descarte de promesas; reduced motion usa extremos estáticos. No se introduce un motor ni se reubican nodos de React. Ver [ADR 008](../decisions/008-visual-depth-photo-motion.md).

## Interacciones finales M2.3

Discovery conserva sus párrafos siempre visibles. Un details nativo opcional descubre un índice de títulos con anclas hacia h3 de Memories; los destinos utilizan posiciones editoriales, porque los ids de recuerdos de V2 admiten espacios y caracteres de fragmento. El epílogo presenta hasta tres títulos del mismo array y una geometría celestial decorativa completa en SSR; su timeline vive en el matchMedia decorativo existente, con scrub reversible y sin pin.

Letter posee useLetter y connectLetter para listeners, modalidad nativa, scroll, foco, preferencias y descarte asíncrono. createLetterAnimation encapsula exclusivamente GSAP en un contexto propio y una sola timeline reversible. El hook depende del contenido de carta; la pausa decorativa no reinicia la lectura. El diálogo inicialmente abierto permite SSR sin JS; la mejora lo cierra y después usa showModal/top layer para escapar de transforms y clipping de ancestros. Cabecera/cierre y cuerpo desplazable son regiones separadas. El scroll exterior queda bloqueado hasta completar la reversión; entonces se restauran estilos, foco y posición. Escape/cancel, resize, cambios de preferencias, cierre externo y desmontaje mantienen esa propiedad. Sin soporte modal se conserva la lectura SSR. No hay captura manual de Tab ni listeners de wheel. Ver [ADR 011](../decisions/011-letter-reading-surface.md), que actualiza ADR 007.

No hay pin, carrusel, scroll capturado, reproducción ambiental, motor genérico, registro de escenas ni estado global. Solo se comparten layout, tokens y recursos fotográficos; no se importan componentes o animaciones de la landing.

## Integraciones futuras

El editor podrá producir el contrato validado y un servicio externo entregarlo por props. La persistencia se resolverá fuera del player cuando exista un caso real. Versionar cambios incompatibles del contrato. No hay interfaces de repositorios, adaptadores vacíos ni dependencia de Supabase.

El laboratorio se inyecta desde `astro.config.mjs` únicamente con `command === 'dev'`. Una ruta dinámica con `getStaticPaths() => []` omitía el HTML pero Astro seguía compilando los chunks de su isla; por eso el entrypoint ahora está fuera de `pages`. `scripts/check-story-build.mjs`, incluido al final de `npm run verify`, comprueba las seis escenas SSR, anclas, estructura básica de la portada y ausencia del laboratorio en artefactos públicos. Véase [ADR 004](../decisions/004-story-player.md).

## Feature landing — M1

- `index.ts` publica únicamente `Landing`; `pages/index.astro` compone layout y feature.
- `components` presenta atmósfera, órbita de polaroids y contenido editorial.
- `data/universe.ts` posee fotografías demostrativas y posiciones deterministas de estrellas: SSR e hidratación coinciden.
- `styles/landing.css` posee composición, responsive y tokens locales; la paleta/fuentes siguen en `styles/global.css`.
- `animations/motion.ts` define tiempos, distancias y easing. Los creadores GSAP son dueños de entrada, ambiente, reveals y parallax.
- `hooks` conecta imports dinámicos con montaje y pausa; descarta resoluciones tardías y revierte el recurso propio.
- `BaseLayout` acepta `immersive` para la portada de ancho completo y su enlace a la idea; conserva la variante de `/demo`. No importa features.

El contexto `matchMedia` revierte sus tweens y ScrollTriggers al cambiar movimiento reducido. El ambiente se pausa con IntersectionObserver y visibilitychange; la pausa manual revierte todo movimiento, también reveals y parallax. La flotación y el parallax actúan sobre wrappers diferentes. CSS posee el feedback de botones; GSAP no anima esos controles. No hay infraestructura, persistencia ni contrato nuevo del Story Player.

## M1.1 — continuidad narrativa

La misma feature incorpora Polaroid reutilizable, StoryActs y un proxy decorativo de bosque. El controlador create-story-animation mide anclajes SSR y usa story-geometry para interpolación reversible; motion define breakpoint y duración del único pin. Hook espera fuentes/imágenes, descarta imports tardíos y conserva lectura al reconstruir por pausa. Los anclajes originales se restauran en modo estático. Ver ADR 003 y verification para límites de evidencia.

## Dedicatoria y build estándar

`features/story-player/local/danna.astro` compone la API pública del mismo renderer y valida su documento independiente. `astro.config.mjs` registra siempre las entradas existentes de Landing, Demo y Danna; el laboratorio se registra exclusivamente con `command === 'dev'`. No hay rutas implícitas en `src/pages` ni selección de perfiles.

[ADR 014](../decisions/014-standard-build.md) sustituye los perfiles de ADR 012/013: `npm run build` produce las tres rutas en la salida estándar `dist/`; no se configura outDir ni publicDir. Los gates comprueban rutas, contenido, recursos y exclusión del laboratorio. No se modifica Story V2 ni el renderer. Danna es pública sin control de acceso por decisión expresa; solo su documento lleva noindex. No hay sitemap ni fotos personales añadidas. Configuración vigente en [despliegue](../deployment-profiles.md).
