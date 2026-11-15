# EntreMomentos — Release Candidate RC1

Fecha: 2026-11-15. **NO-GO para despliegue de prueba.** Los gates de código y exclusión pública pasan; la aceptación visual, responsive y de interacción real está bloqueada. No se ha desplegado, publicado, creado commits ni hecho push.

## Alcance y hallazgos

Se inspeccionaron AGENTS.md, README, arquitectura, ADR 001–011, fundamentos visuales, verificación y protocolos QA existentes, rutas, componentes, hooks, animaciones y CSS de Landing y Story Player. Esta carpeta no tiene repositorio Git reconocible; no se inicializó uno. No hay harness de Playwright/Cypress/Puppeteer ni script de pruebas de navegador en el proyecto. Las pruebas existentes usan Vitest, dobles DOM/React/GSAP, render SSR y algunas timelines GSAP numéricas reales.

| Prioridad                | Hallazgo                                                                                                                   | Estado / acción                                                                                                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------------------------<!--  -->----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bloqueante de aceptación | No se pueden iniciar servidor ni navegadores; ningún viewport ni interacción real tiene evidencia válida                   | NO-GO; ejecutar matriz manual inferior en entorno funcional                                                                                                            |
| P2 documental            | `m23-browser.md` todavía pedía Tab libre, carta en flujo y sin scroll interno; contradice implementación y ADR 011         | Marcado explícitamente como histórico y enlazado al protocolo vigente                                                                                                  |
| Cobertura QA             | La carta comprobaba tres ciclos completos y diez desmontajes interrumpidos; el visor comprobaba diez cierres interrumpidos | Carta ampliada a diez ciclos completos con una sola animación y listeners equilibrados; visor añade diez ciclos completos y limpieza de listeners/animaciones/observer |

**No se confirmó un defecto nuevo de producto P0, P1 o P2 con evidencia suficiente para cambiar UI.** Esto no acredita su ausencia: layout, clipping, solapes, foco nativo y movimiento siguen sin observarse. No se alteró código de producto, textos aprobados, dependencias, arquitectura ni diseño. Las correcciones de interfaz previas descritas en otros documentos no se atribuyen a esta revisión.

## Inspección técnica

- Astro estático compone dos islas React con `client:load`; las seis escenas y la carta se prerenderizan. Browser APIs y GSAP se conectan desde efectos; la suite SSR y el build pasan. **Hidratación en navegador no ejecutada.**
- Los contenedores usan porcentajes, `min()`, `clamp()` y gutters. Global cambia a 48rem y permite envolver header hasta 24rem. Landing usa 23rem, 48rem y 80rem; narrativa de escritorio usa 64rem y altura mínima de 45rem. Player cambia a 30rem, 48rem y 64rem. No se encontró `100vw` en las fuentes inspeccionadas.
- Landing deja visible el overflow del ancestro del panel fijado; recorta la decoración del hero. El proxy fotográfico es fixed y decorativo. Tiene un pin solo desde 1024px de ancho y 720px de alto, con recorrido de 0.65 alturas de viewport. **1024×768 y 1440×900 activan ese pin**; requieren ida/vuelta y anclas reales.
- Story Player no usa pin. Galería y epílogo separan fondo a ancho completo de lectura limitada. Discovery/Letter conservan gutters y máximos de lectura. Atmósferas absolutas recortan decoración con máscaras; no se certifica continuidad de fondos mediante inspección CSS.
- Fotografías de contenido usan dimensiones, ancho flexible y altura automática; el visor limita tamaño sin forzar proporciones. Proxy usa geometría con escala uniforme. No se certifica imagen pintada ni continuidad de recorte.
- Carta: diálogo nativo top layer, máximo 38rem, márgenes laterales de 1rem y altura `100dvh - 2rem`; cabecera separada del cuerpo con overflow interno. No depende de transforms de ancestros. Escape/cancel, cierre externo, resize, foco/scroll y reducción se ejercitan con dobles. El área de lectura tiene foco de teclado. Tab nativo, touch, barras móviles y orientación siguen pendientes.
- Player posee contextos `matchMedia`, revierte recursos propios y agrupa refrescos por fuentes, imágenes y ResizeObserver. Landing mide tras fuentes y decode y llama a `ScrollTrigger.refresh()` global al inicializar su coreografía; no hay eliminación global de triggers. Son páginas separadas y no se confirmó interferencia, por lo que no se modificó.
- Pausa decorativa y reduced motion mantienen estados independientes; carta y visor conservan controladores propios. La limpieza y descarte de imports tardíos pasan en harness. No equivale a contar recursos en un navegador real.

## Ruta personal y privacidad pública

**La ruta existe realmente**: `src/features/story-player/local/danna.astro` importa el documento local validado y compone StoryPlayer; `preview.css` solo enfatiza el mensaje final. No es una ruta deducida de documentación.

Se ejecutó el hook real de `astro.config.mjs` para `dev`, `build` y `preview`, comprobando además que existen los entrypoints registrados: `/para/danna/` y `/dev/gsap` solo se inyectan en dev. Build/preview no registran ninguno. Evidencia: `evidence/rc1/entremomentos-rc1-routes.log`.

El build recién generado contiene únicamente `/` y `/demo`. `check-story-build.mjs` recorre todos los archivos de dist, incluidos props serializados, chunks, CSS y mapas; no encontró marcadores personales. Prueba negativa: se añadió temporalmente un source map con un marcador personal, el gate lo rechazó y se retiró en `finally`; el artefacto limpio pasó otra vez. Evidencia: `entremomentos-rc1-privacy-negative.log`. Es una comprobación de exclusión de este documento y marcadores conocidos, no un mecanismo general de autenticación.

SHA-256 comprueba que documento aprobado y lockfile permanecen intactos respecto a la captura anterior a las ediciones RC1 (`entremomentos-rc1-preserved.sha256`). No se copiaron textos de la carta al informe. Dev debe servirse solo en loopback; el futuro despliegue debe usar **dist**, nunca el servidor dev. La respuesta HTTP 404 de `/para/danna/` en preview queda pendiente: curl no pudo abrir socket. No se afirma haberla observado.

## Pruebas ejecutadas

Entorno: Node 24.22.1, npm 12.2.2; shell bash, sandbox con red/sockets restringidos. Logs conservados en [evidencia RC1](evidence/rc1/).

| Prueba                                          | Resultado real                                                                                                                                                 |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                                        | Código 0; 559 paquetes instalados; aviso de deprecación de ESLint 9.39.5                                                                                       |
| `npm ls --all`                                  | Código 0; árbol completo sin peers inválidos                                                                                                                   |
| `npm run verify` inicial                        | Código 0: Astro check 80 archivos sin diagnósticos, ESLint, formato, 15 archivos / 157 tests, build y gate público                                             |
| Vitest focalizado tras ampliar ciclos           | Código 0: 2 archivos / 39 pruebas                                                                                                                              |
| `npm run verify` final                          | Código 0: check (80 archivos, cero diagnósticos), lint, formato, 15 archivos / 158 pruebas, build de dos páginas y gate público; `entremomentos-rc1-final.log` |
| Registro real de rutas dev/build/preview        | Código 0; entrypoints existentes, inyección exclusiva de dev                                                                                                   |
| Gate de privacidad negativo y artefacto limpio  | Código 0; rechazo esperado de mapa contaminado, retirada y aprobación limpia                                                                                   |
| Diez ciclos completos de carta                  | Aprobado en dobles DOM: mismo controlador/animación, scroll/foco solicitados y listeners retirados con las mismas referencias                                  |
| Diez ciclos completos de visor                  | Aprobado en dobles DOM: diez sesiones, diez reversiones/desconexiones, listeners equilibrados, ningún cierre duplicado posterior                               |
| SSR y carta larga                               | Aprobado en Vitest y HTML generado; contenido único, firma y anclas presentes. Sin evaluación de layout                                                        |
| Navegador, hidratación, teclado y scroll reales | **Bloqueados**; sin capturas válidas                                                                                                                           |

No se ejecutó auditoría de vulnerabilidades en línea ni medición de rendimiento; `npm ls` no las sustituye. El aviso de soporte de ESLint queda como mantenimiento pendiente, sin cambiar dependencias en esta RC.

## Bloqueos reproducidos

| Intento                                                                          | Resultado                                                                                     |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `npm run dev -- --host 127.0.0.1`                                                | Código 1; `Dev server process exited before becoming ready`                                   |
| `npm run preview -- --host 127.0.0.1`                                            | Código 1; `Preview server process exited before becoming ready`                               |
| Firefox headless, captura de `about:blank`                                       | Código 139, segmentation fault; ninguna captura válida                                        |
| Edge headless con no-sandbox, disable-gpu y disable-dev-shm-usage, `about:blank` | Código 133; crashpad `setsockopt: Operation not permitted`; ninguna captura válida            |
| curl a `/para/danna/`                                                            | Código 7; `failed to open socket: Operation not permitted`                                    |
| Contexto Impeccable                                                              | Motor no descargable por red; se consultó contexto local y craft floor; detector no ejecutado |

Los navegadores fallan incluso sin aplicación. Los errores no demuestran un fallo de hidratación ni de la UI. No se solicitaron privilegios ni se cambiaron restricciones del entorno.

## Evidencia por viewport

**B = bloqueado antes de renderizar; ninguna casilla es una aprobación visual.** Ejecutar V1–V8 y las interacciones I1–I9 en cada fila. En Danna, galería/visor no aplican: el documento aprobado no contiene fotografías ni recuerdos; se prueban en `/demo`.

| Viewport CSS px | Landing `/` | `/demo` y Player | `/para/danna/` | Atención específica pendiente                                        |
| --------------- | ----------- | ---------------- | -------------- | -------------------------------------------------------------------- |
| 320 × 568       | B           | B                | B              | Header envuelto, CTA, carta larga y cierre en poca altura            |
| 375 × 667       | B           | B                | B              | Cambio respecto al breakpoint 23rem, leyenda del hero, controles     |
| 390 × 844       | B           | B                | B              | Header sin envolver, lectura, anclas y collage en flujo              |
| 430 × 932       | B           | B                | B              | Espaciado móvil, fotos/acciones y márgenes del diálogo               |
| 768 × 1024      | B           | B                | B              | Salto a 48rem: navegación, galería alternada, Connection en columnas |
| 1024 × 768      | B           | B                | B              | Activación del pin y composición de escritorio; altura disponible    |
| 1440 × 900      | B           | B                | B              | Anchos máximos, continuidad de fondos y proxy entre cuatro anclajes  |

Guardar por fila: navegador/versión/SO, fecha, fuentes remotas o fallback, ruta, zoom, preferencias; capturas del hero y todas las escenas, carta cerrada/abierta y visor. Añadir vídeo de scroll/apertura/cierre; las capturas aisladas no prueban saltos ni suavidad. No guardar capturas personales en `public` ni `dist`; conservar las de Danna localmente.

## Matriz manual concreta

Preparación local en entorno funcional:

```bash
npm ci
npm ls --all
npm run verify
npm run dev -- --host 127.0.0.1
# En otra terminal, para el artefacto público:
npm run preview -- --host 127.0.0.1 --port 4322
```

Usar el puerto real indicado por Astro. Danna solo se comprueba en dev; `/` y `/demo` se comprueban también en preview. Abrir consola y Network antes de cargar; registrar errores sin descartarlos.

| ID  | Pasos en cada viewport                                                                                                                                            | Criterio de aprobación                                                                                                                                  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| V1  | Recorrer de inicio a footer; comparar `document.documentElement.scrollWidth` y `clientWidth` en reposo, escenas, carta/visor                                      | Sin scroll horizontal; investigar cualquier diferencia mayor de 1px, también visualmente                                                                |
| V2  | Capturar límites de cada escena, fondo y footer en ambas direcciones                                                                                              | Sin cortes verticales bruscos ni franjas inesperadas                                                                                                    |
| V3  | Revisar títulos, párrafos, leyendas, firma y foco a 100% y 200%                                                                                                   | Ningún texto recortado ni contenido inaccesible                                                                                                         |
| V4  | Llegar por Tab y touch a navegación, pausa, sobre y cierres                                                                                                       | Controles alcanzables; ningún botón fuera del área visible del diálogo                                                                                  |
| V5  | Comparar fotos originales con galería, proxy y visor                                                                                                              | Proporción conservada; recorte intencional continuo, sin deformación                                                                                    |
| V6  | Abrir/cerrar details, carta y visor; revisar cabeceras y texto                                                                                                    | Ningún interactivo superpuesto que impida otra acción                                                                                                   |
| V7  | Grabar scroll lento/rápido, entrada/salida y retorno por cada escena                                                                                              | Sin saltos de lectura ni restos de pin/proxy al invertir                                                                                                |
| V8  | Repetir con pausa, reduce y JS desactivado antes de cargar                                                                                                        | Narrativa, carta y firma disponibles; anclas/details/enlaces de fotos funcionan                                                                         |
| I1  | Scroll completo normal e inverso con wheel, touch y teclado; en Landing pasar las cuatro posiciones del bosque                                                    | Sin atrapamientos ni escenas invisibles; pin solo donde corresponde                                                                                     |
| I2  | Activar todas las anclas, recargar con hash intermedio, ir a otra ruta y volver por historial                                                                     | Destino correcto, foco visible al activar, lectura/restauración sin salto tardío al cargar GSAP                                                         |
| I3  | Abrir carta con Enter y Espacio; Tab/Shift+Tab dentro del modal, enfocar cuerpo y usar flechas/PageDown hasta firma; cerrar con botón/Escape                      | Cabecera accesible, Tab contenido de forma nativa, exterior bloqueado hasta terminar reversión; foco y posición retornan al sobre                       |
| I4  | En 320×568 leer carta completa de Danna; probar además fixture temporal con párrafos largos, palabra sin espacios y firma larga, sin editar el documento aprobado | Solo cuerpo interno desplazable, texto y firma completos, cierre siempre alcanzable                                                                     |
| I5  | Ampliar cada foto de demo, recorrer créditos/lectura y cerrar con botón/Escape, también antes de terminar apertura                                                | Sin deformación, proxy residual ni bloqueo; foco vuelve al enlace y scroll a posición anterior                                                          |
| I6  | Pausar/reanudar y cambiar reduce antes de carga y durante apertura/cierre; repetir con carta/visor abiertos                                                       | Intención conservada, reducción sin desplazamiento espacial; pausa decorativa no bloquea interacciones                                                  |
| I7  | Cambiar 375×667 a 667×375, 768×1024 a 1024×768 y volver; resize durante apertura, lectura y cierre                                                                | Reencuadre correcto; sin clipping, controles perdidos ni desplazamiento residual                                                                        |
| I8  | Diez ciclos completos por modal, alternando Escape/botón, y cierres rápidos durante entrada; registrar recursos con profiler/harness del navegador                | Un diálogo/proxy activo como máximo, recursos de animación/listeners sin crecimiento entre estados cerrados equivalentes; sin scroll bloqueado residual |
| I9  | Recargar dev y preview con consola abierta, JS activo; repetir con JS desactivado y fuentes bloqueadas; solicitar ruta personal en preview                        | Sin errores de hidratación/JS, HTML legible con fallback; preview devuelve 404 para ruta personal y artefactos siguen limpios                           |

La observación de listeners debe filtrar los nodos/controladores propios y comparar tras esperar la reversión y tareas asíncronas, evitando contar listeners delegados permanentes de React como fuga. Para triggers decorativos comparar estados equivalentes con idéntica preferencia y pausa. Sin instrumentación real, I8 se registra como parcial, aunque los ciclos se vean correctos.

## Condición de salida RC1

Para cambiar a GO: ejecutar toda la matriz en los siete tamaños, registrar evidencias y resolver defectos confirmados P0/P1; repetir verify y gate público después de cualquier corrección; comprobar 404 real en preview. Los detalles P2 restantes deben quedar identificados y aceptados. Falta especialmente probar hidratación, scroll/anclas con pin, modalidad/teclado, carta larga, orientación y limpieza real de recursos.

Esta revisión termina antes de cualquier despliegue. El artefacto público pasa exclusión de contenido local, pero la experiencia aún no tiene aceptación de navegador.
