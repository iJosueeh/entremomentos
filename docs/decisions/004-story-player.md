# ADR 004 — Story Player: contrato y composición M2.0

Estado: implementado; resultados integrados y límites de navegador en [verificación](../verification.md). Alcance aprobado: M2.0 exclusivamente.

## Decisión y fronteras

Evolucionar la feature existente. `/demo` compone BaseLayout normal y una isla React `StoryPlayer client:load` con documento local validado. Las futuras vistas previas e historias publicadas usarán `StoryPlayer({ story: Story })`; no existen aún esas rutas ni publicación real. No hay consultas, almacenamiento, autenticación, backend o dependencia de Supabase.

Las seis escenas permanecen montadas en orden: IntroScene, ConnectionScene, MemoriesScene, DiscoveryScene, LetterScene y EpilogueScene. Presentación en components; estado/efectos del navegador en hooks; GSAP en animations; documento en schemas/data. No se introduce un motor configurable, registro de escenas, master timeline, estado global, dependencias nuevas ni carpetas sin uso.

La API del renderer es `index.ts`, con StoryPlayer y el tipo Story. La entrada pública `document.ts` expone storySchema, Story y demoStory. Separarlas evita que los efectos de validación de la fixture introduzcan Zod y los datos de ejemplo en el bundle del renderer. La validación se realiza antes del render; futuras entradas externas usarán safeParse y errores resueltos por el consumidor.

Se reutilizan BaseLayout, tokens/global.css y los tres paisajes con su procedencia. Polaroid, StoryActs, hooks y coreografía de la landing conservan su propiedad: dependen del bosque, cuatro anclajes y reglas concretas de M1.1. StoryPhoto es específico del player; no se extrae una abstracción visual compartida sin un uso común real. Se conserva el código de la landing.

## Contrato del prototipo

V2 es incompatible con V1 porque añade contenido narrativo obligatorio. `schemaVersion` es el literal 2. V1 y su fixture se conservan en dev y tienen pruebas independientes. El renderer V2 no acepta ni migra automáticamente documentos V1: no puede inventar sus escenas faltantes.

Todos los tipos documentales se infieren de Zod. El documento contiene:

| Campo                                    | Regla                                                                              |
| ---------------------------------------- | ---------------------------------------------------------------------------------- |
| id                                       | Slug no vacío en minúsculas, números y guiones                                     |
| title                                    | Texto recortado de 1–120 caracteres; es el h1 de Intro                             |
| theme                                    | Literal celestial-nostalgia; no hay registro de temas                              |
| memories                                 | 1–100, en orden editorial; id no vacío y único, fecha ISO real, title y message    |
| scenes.intro                             | Al menos un párrafo                                                                |
| scenes.connection / discovery / epilogue | title y al menos un párrafo                                                        |
| scenes.memories                          | title e introduction                                                               |
| scenes.letter                            | title, párrafos y firma de 1–120 caracteres                                        |
| memories[].image                         | Opcional; src local absoluto o HTTPS, alt no vacío, width/height enteros positivos |
| image.credit                             | Opcional; autor, URL de origen HTTPS, licencia y URL HTTPS de licencia             |

Cada párrafo, introducción y message admite 1–4000 caracteres tras trim. El contenido es texto plano escapado por React; no se admite HTML inyectado. Las imágenes narrativas requieren alt; la decoración es código aria-hidden. Las fotografías stock de la fixture incluyen siempre atribución visible. La validación de URL no comprueba disponibilidad o licencia de nuevos archivos; esa responsabilidad pertenece a quien produce el documento.

El contrato no exige nombres, géneros ni roles de pareja. Permite amistad, familia, pareja y otros vínculos a través de sus textos. La muestra «Los caminos que nos quedan» cuenta una amistad ficticia entre Alma y Nico, con tres paisajes ilustrativos y fechas editoriales. No son recuerdos personales ni testimonios.

## Navegación, SSR y accesibilidad

Modo de superficie: experiencia narrativa dentro de la identidad Celestial Nostalgia existente. M2.0 entrega una composición básica, no el diseño final de las seis escenas. Una sola isla preserva el HTML prerenderizado y evita coordinación entre islas por escena. No se usa client:only.

Un h1 y cinco h2 identifican las escenas; los recuerdos forman una lista con h3 y time. Todos los textos, fotos y la carta están en HTML antes de JavaScript. El renderer genera identificadores deterministas a partir del slug y la escena; se monta un player por página. La narrativa puede leerse sin interactuar y sin animaciones.

La navegación es una lista discreta de seis anclas con área mínima de 44px. Un observer independiente de motion marca aria-current=location al cruzar la franja central del viewport; resize reconstruye sus márgenes en píxeles. El scroll no altera el foco. La activación normal de una ancla de navegación enfoca el título con preventScroll y conserva la navegación nativa, incluyendo historial/hash; los modificadores conservan el comportamiento del navegador. Intro y Epilogue incluyen enlaces nativos de continuación y regreso con títulos enfocables.

Pausar decoración nunca bloquea enlaces, observación de escenas o futuras interacciones. Recuerdos y carta no están condicionados por un estado global de avance. Las expansiones opcionales de hitos siguientes no podrán exigir completar acciones para continuar.

Los estilos del player se acotan a su raíz. Las fotos reservan dimensiones reales: montaña 640×423, bosque 640×440 e invierno 640×424; usan lazy y decoding async. No se crean placeholders cuando falta una fotografía. Los estilos técnicos de M0 se trasladan desde global.css a dev/styles.

## Movimiento y ciclo de vida

M2.0 usa un solo tween decorativo de Intro: transform y de +24px a -24px, ease none y ScrollTrigger scrub 0.5, sin pin. No se implementa una entrada temporizada adicional ni coreografía de galería/carta. Así se valida una integración real sin adelantar M2.1–M2.3.

manuallyPaused pertenece a StoryPlayer; reducedMotion refleja el navegador en useStoryMotion. Activar reduced motion no sobrescribe la pausa elegida por la persona. Ambos estados se mantienen diferenciados y cualquiera puede impedir crear la decoración. El control de pausa solo aparece tras la mejora cliente y se oculta con reduced motion; se reserva su espacio. El estado reducido se comunica con un texto de estado, sin usar un botón deshabilitado como sustituto.

El hook carga GSAP dinámicamente solo cuando está permitido, comparte un import en curso por efecto y descarta generaciones obsoletas al cambiar preferencias o desmontar. La referencia del documento forma parte de sus dependencias, no solo story.id. El creador registra ScrollTrigger y utiliza gsap.matchMedia con selectores acotados; revert limpia sus tweens y triggers. Ante inicialización parcial fallida también revierte el contexto. El hook retira su listener; navegación retira su listener/observer. Nunca se usa getAll().kill ni otra limpieza global.

No se espera a descargar toda la galería. En esta versión el único trigger depende de Intro y las imágenes posteriores reservan espacio; no necesita un coordinador de refresh. Si M2.2 introduce geometría dependiente de imágenes, deberá agrupar sus refrescos y cancelar callbacks pendientes. Los fallos de GSAP dejan el contenido estático disponible.

## Laboratorio, pruebas y siguientes hitos

Se conserva MotionDemo con su contrato V1, fixture, hook, animación, controles de montaje/desmontaje y estilos dentro de dev. Solo astro dev inyecta `/dev/gsap` mediante astro:config:setup. No basta con getStaticPaths vacío: el primer build demostró que Astro seguía generando chunks de la isla técnica aunque no produjera su HTML. El entrypoint está fuera de pages para excluir ruta, JavaScript y CSS de producción.

Vitest cubre contratos V1/V2, medios, render SSR, anclas, fotografías opcionales, cantidades variables y escape de texto. Los tests de hooks ejercitan efectos mediante dobles de React/navegador: preferencias rápidas, imports tardíos, pausa independiente, sustitución de documento con igual id, diez montajes, errores y limpieza. Los tests del creador usan un doble de GSAP: comprueban propiedad y reversión solicitada, no la integración real del plugin.

`npm run verify` ejecuta también check-story-build después del build. Comprueba escenas y texto en HTML, destinos de anclas, cuatro anclajes de la landing, CTA a demo y ausencia del laboratorio/validación en recursos cliente. No sustituye revisión visual, teclado real, hidratación, estilos revertidos por GSAP ni mediciones en dispositivo.

M2.1 diseña Intro/Connection; M2.2 implementa recuerdos progresivos; M2.3 desarrolla Discovery/Letter/Epilogue; M2.4 verifica integración, responsive, accesibilidad y rendimiento. Todos evolucionan el mismo renderer. El peer previo de tooling y los pendientes manuales de M0/M1 siguen registrados por separado.

Skills aplicadas: Ponytail, Lean Build, Clean/Hexagonal (solo fronteras), Impeccable, Frontend Atlas, Motion Director y GSAP; revisión crítica en la planificación e Investigate First para el fallo de imports concurrentes en el harness. Prevalecen el brief, la identidad existente y el alcance aprobado. El motor de Impeccable no estaba disponible; no se instaló ni se declara un gate visual aprobado.

Referencias oficiales: [Astro y componentes hidratados](https://docs.astro.build/en/guides/framework-components/), [inyección de rutas de desarrollo](https://docs.astro.build/en/reference/integrations-reference/), [React e hidratación](https://react.dev/reference/react-dom/client/hydrateRoot), [GSAP matchMedia y reversión](<https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/>), [Zod](https://zod.dev/api).
