# ADR 005 — M2.1: Un universo que recuerda

Estado: implementado; verificación integrada y límites de aceptación en [verification](../verification.md). Continúa [ADR 004](004-story-player.md) sin cambiar el contrato V2. Alcance: Intro y Connection exclusivamente.

## Dirección y límites

Modo de superficie: experiencia narrativa. Se conserva Celestial Nostalgia: Midnight, Ivory, Blush, Lavender, Cormorant Garamond y DM Sans. La luz representa un recuerdo que aparece; dos luces construyen una constelación al encontrarse. No se añaden nombres, géneros ni roles al contrato: los textos siguen llegando del documento y la amistad de Alma y Nico permanece ficticia. El aviso de ficción de `/demo` se conserva después de la historia para dejar que la apertura empiece con el relato.

Intro: cielo con profundidad radial, estrellas discretas, luz central, título editorial, mensaje personalizado y enlace nativo a Connection. Connection: texto integrado junto al encuentro y constelación, seguido de una iluminación que se disuelve hacia Memories. No se implementan las coreografías definitivas de las otras cuatro escenas.

Se amplía el player hasta el ancho disponible de BaseLayout (72rem). El wrapper de apertura posee el cielo compartido. Las escenas posteriores mantienen 46rem. En móvil Connection apila texto y diagrama; las alturas mínimas crecen con contenido válido largo y fuentes fallback. No hay overflow oculto sobre texto o foco.

## Propiedad y coste

- `components`: escenas semánticas, `OpeningSky` y `ConnectionConstellation`. SVG y CSS producen la decoración; coordenadas fijas para SSR/hidratación idénticos. Ninguna decoración se anuncia a tecnologías de asistencia.
- `animations`: creadores concretos por escena y parámetros en `motion.ts`. El compositor conserva un único matchMedia propio. No hay master timeline, motor de escenas o dependencia de Landing.
- `hooks`: se conserva el ciclo de vida de M2.0, con import dinámico, descarte de generaciones, pausa manual y preferencia reducida independientes. La navegación tiene su propio efecto.
- `schemas/data`: sin cambios; los textos no se fragmentan ni se inspeccionan para extraer participantes. No hay contenido esencial generado por GSAP.

Sin dependencias, imágenes, fuentes o servicios nuevos. 32 estrellas estáticas, dos gradientes SVG y halos CSS; no hay canvas, WebGL, blur animado ni bucles. Se animan transform y opacity; la excepción deliberada es strokeDashoffset en dos paths pequeños normalizados con pathLength=1. No se añaden listeners de scroll ni cálculos de layout por frame.

## Contrato de movimiento

| Escena         | Trabajo                                                      | Temporización / recorrido                                                              |
| -------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| Intro, entrada | Emerger luz y asentar título sin retrasar lectura            | Luz 1.1s, título 0.8s, power2.out; título de opacidad 0.78 y y=12px a opacidad 1 e y=0 |
| Intro, salida  | Dar continuidad a la luz mientras se deja atrás el mensaje   | Desplazamiento 0→64px; top top a bottom top; ease none, scrub 0.5                      |
| Connection     | Aproximar luces, conectar constelación, aumentar profundidad | top 85% a center 45% del diagrama; ease none, scrub 0.5; sin pin                       |

Los párrafos y enlaces no se animan ni esperan una entrada. No hay loader, compuerta, smooth scroll o navegación condicionada. El título solo tiene entrada al crear por primera vez una escena visible; un WeakSet evita repetirla tras pausa/reanudación y los enlaces profundos fuera de Intro la omiten. La decoración de entrada y la de scroll usan wrappers diferentes para evitar escribir simultáneamente la misma transformación.

La secuencia de Connection recorre las mismas propiedades en ambos sentidos. Las dos luces permanecen distinguibles en sus posiciones finales, conectadas por una constelación. Al pausar o reducir movimiento se revierte el contexto completo y aparece el estado estático terminado, no una fase incompleta. Reanudar reconstruye los timelines de scroll en la posición actual. No se exige congelar una fase intermedia; se mantiene el contrato estático de pausa de M2.0.

El matchMedia posee todos los timelines y triggers. Su reversión, también ante fallo parcial, restaura estilos. Tras fonts.ready se refrescan únicamente los triggers de las dos escenas; un indicador local y otro de disposición impiden refrescos tardíos después de revertir/desmontar. No se matan ni refrescan triggers globalmente.

## Skills y decisiones frente a recetas

Se aplicaron design-taste-frontend (jerarquía, unidad visual, ausencia de reveals repetidos, peso), ui-ux-pro-max (consulta de reducción de movimiento y sensibilidad), Impeccable (modo Experience y craft floor), motion-director (propósito, interrupción, reversión y estado estático), GSAP (timelines y propiedad del contexto) y Ponytail (reutilización y alcance mínimo).

Prevalecen el brief y la identidad existente sobre recetas comerciales de las skills: no se cambia la paleta Lavender, no se sortea otro estilo, no se convierte la historia en una landing de venta, no se sustituyen textos documentales ni créditos, ni se importa un kit visual/motor paralelo. La recomendación genérica de smooth scroll del buscador UX se descarta porque el brief exige scroll nativo. El motor de contexto de Impeccable no pudo descargarse; se usaron sus referencias locales. No se declara su detector ni un gate visual aprobados.

## Prueba y aceptación

Vitest cubre SSR completo y determinista, contenido genérico de varios párrafos, anclas enfocables, propiedad de los timelines, ausencia de pin, título siempre visible, entrada única, enlaces profundos, trazado normalizado, refresh de fuentes y descarte tras limpieza. Se conservan los tests previos de preferencias rápidas, pausa independiente, errores y diez montajes, además del contrato V2 y las pruebas de Landing. Los dobles de GSAP/React verifican operaciones solicitadas, no la reversión real de estilos o la fluidez en navegador.

La revisión real de escritorio/móvil, scroll ida/vuelta, teclado, cambio de preferencias, pausa/reanudación, overflow, zoom, hidratación y rendimiento queda pendiente si el entorno no permite navegador. No se puntúan timing, suavidad ni rendimiento con la rúbrica de Motion Director sin observación. Ver resultados e intentos concretos en [verification](../verification.md).

Documentación oficial consultada: [GSAP context y revert](<https://gsap.com/docs/v3/GSAP/gsap.context()/>), [ScrollTrigger y scrub](https://gsap.com/docs/v3/Plugins/ScrollTrigger/). El runtime instalado es GSAP 3.15.1.
