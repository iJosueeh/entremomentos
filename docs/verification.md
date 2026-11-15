# Build estándar — 2026-11-15

Estado vigente: `npm run verify` aprobado (código 0), log `/tmp/entremomentos-standard-verify.log`. Astro check: 82 archivos, cero errores/warnings/hints; ESLint y Prettier aprobados; Vitest: 16 archivos y 170 pruebas; un único build en `dist/`, 27 archivos y exactamente las páginas `/`, `/demo/` y `/para/danna/`. Gates de rutas, recursos locales, SSR, anclas, noindex y exclusión del laboratorio aprobados. El build limpió las salidas anteriores; no quedan subdirectorios de perfiles.

Se retiraron la selección por entorno, outDir/publicDir específicos, runner, comandos y ramas de gates de perfiles. `npm run build` compila y verifica `dist/`; `npm run preview` usa la salida estándar. Una autocomprobación del hook de configuración aprobó las mismas tres rutas para valores antiguos o desconocidos de BUILD_PROFILE y el laboratorio solo en dev, con outDir/publicDir sin definir.

`git diff --exit-code` confirmó sin cambios Story V2, componentes/hooks/animaciones/estilos del Player, contenido de Danna, Landing, rutas existentes y lockfile. Se conservan noindex y acceso público sin autenticación. No se añadieron fotografías, dependencias ni datos privados. La documentación de Vercel usa ahora build `npm run build`, output `dist` y ninguna variable de perfil; [ADR 014](decisions/014-standard-build.md), [guía](deployment-profiles.md).

No se ejecutó nueva validación visual: este cambio afecta compilación y enlaces del layout; la revisión de responsive, carta, navegación/scroll y GSAP en navegador sigue pendiente con los bloqueos registrados anteriormente. No se inspeccionó ni modificó Vercel, desplegó, creó otro proyecto, ejecutó commit o push.

Los registros siguientes son históricos y no describen los comandos vigentes. Los perfiles y la obligación de dos proyectos están retirados para esta versión.

# Despliegue unificado — 2026-11-15

Estado vigente: `npm run verify` aprobado (código 0): Astro check sin diagnósticos, lint, formato, 165 pruebas y builds public/personal/unified con gates. Unified genera las tres rutas en 27 archivos. Danna es pública sin control de acceso por decisión explícita para v1, con noindex y sin fotos. No se creó otro proyecto ni se desplegó, hizo commit o push.

QA visual y HTTP pendientes: Firefox falla antes de renderizar `about:blank` y preview termina antes de ready. No se aprueba responsive, scroll, hidratación ni GSAP en navegador. Evidencia y pasos: [QA unified](qa/unified-deployment.md); configuración del único proyecto existente: [despliegue](deployment-profiles.md), [ADR 013](decisions/013-unified-deployment.md).

Los registros siguientes son históricos. La exigencia de dos proyectos y de protección previa de la historia se sustituye para esta versión por la aceptación expresa de acceso público descrita arriba; los perfiles aislados se conservan.

# Perfiles público y personal — 2026-11-15

`npm run verify` aprobado (código 0): Astro check, ESLint, Prettier, Vitest y ambos builds con gates. Registro local: `/tmp/entremomentos-profiles-verify.log`. El formato de la tabla de `qa/rc1.md` ya fallaba en Prettier; se normalizó sin cambiar su contenido para completar el gate global.

- Público: 2 páginas (`/` y `/demo`), 26 archivos; exclusión de datos/estilos personales y laboratorio aprobada en todos los artefactos.
- Personal: 1 página (`/para/danna/`), 10 archivos; seis escenas SSR, firma, hidratación y recursos previstos; sin landing, demo ni sus fotografías.
- Pruebas nuevas: ruta personal obligatoria, rechazo de rutas públicas infiltradas, medios/chunks sobrantes y datos personales ocultos en un chunk público.
- Autocomprobación del runner: tres combinaciones inválidas de perfil abortan antes de compilar. Comparación con Git: las páginas trasladadas conservan sus bytes; documento Danna, Story V2, estilos y animaciones no tienen cambios.

La configuración del hosting y las pruebas HTTP de autenticación **no se ejecutaron**. No se ha desplegado, creado commits ni hecho push. No se declara aceptación visual ni de interacción nueva; RC1 conserva sus pendientes. La publicación personal requiere primero probar All Deployments sobre un despliegue inocuo. Véanse [guía operativa con variables, comandos, planes y Cloudflare Access](deployment-profiles.md) y [ADR 012](decisions/012-build-profiles.md).

# RC1 — 2026-11-15

Ver [informe RC1 y matriz manual](qa/rc1.md). Instalación y árbol aprobados; QA visual, HTTP e hidratación real bloqueados. Veredicto: **NO-GO** hasta ejecutar la matriz de navegador. Los registros siguientes son históricos y no sustituyen RC1.

# Refinamiento de LetterScene — 2026-11-15

Estado: implementación compartida completada; `npm run verify` aprobado (código 0). QA visual y de interacción real pendiente por fallos del servidor y navegadores. Esta entrada actualiza la composición de carta descrita en la historia local v1; el contenido narrativo y Story V2 no cambian.

## Resultado y preservación

Se corrigió la combinación incompatible de filas locales, margen negativo compartido y scroll del artículo completo. Se retiraron esos estilos y el cierre sticky. Sobre centrado de hasta 20rem, superficie de lectura de hasta 38rem, márgenes seguros y altura limitada por el viewport; cabecera/cierre fuera del cuerpo desplazable. El diálogo nativo usa el top layer para evitar recortes o coordenadas incorrectas por ancestros transformados. SSR/sin JS conserva un único mensaje completo, sin modalidad; el cliente presenta el sobre cerrado al iniciar.

Se conserva un contexto GSAP y una timeline reversible: solapa, salida plegada desde el rectángulo real del sobre, expansión y centrado, con atenuación del fondo. Cerrar mantiene la modalidad hasta invertir el movimiento; después restaura overflow/gutter, foco y posición de página. Resize, cierre nativo externo, cambios de movimiento reducido, fallback sin GSAP y desmontaje quedan cubiertos. La regla de tabindex de ESLint sigue activa en nivel error y permite regiones desplazables etiquetadas solo en LetterScene, para mantener acceso con Tab al texto en navegadores sin foco automático de scrollers.

SHA-256 antes/después confirma intactos `local/danna-story.ts`, `schemas/story.ts`, `src/pages/demo.astro` y `data/demo-story.ts`. La mejora visual es compartida con `/demo`. La vista `/para/danna/` continúa inyectada únicamente en dev; el artefacto público solo contiene `/` y `/demo`, sin datos personales. No se añadieron dependencias, commits, push, hosting ni despliegue.

## Evidencia ejecutada

| Comprobación            | Resultado                                                                                                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run verify`        | Código 0; `/tmp/entremomentos-letter-verify.log`                                                                                                                                              |
| Astro check             | 80 archivos, cero errores/warnings/hints                                                                                                                                                      |
| ESLint y Prettier       | Aprobados                                                                                                                                                                                     |
| Vitest                  | 15 archivos, 157 pruebas aprobadas                                                                                                                                                            |
| Pruebas de carta        | SSR único y estructura cabecera/cuerpo; foco tras reversión, scroll/estilos originales, Escape/cancel, cierre externo, reaperturas, resize, reducción de movimiento y limpieza con dobles DOM |
| GSAP real               | Objetos numéricos: extremos, interrupciones, origen medido, recálculo y reversión; no certifica render del navegador                                                                          |
| Build y privacidad      | Dos páginas; gate de seis escenas, anclas y exclusión de la dedicatoria aprobado                                                                                                              |
| Preservación documental | `sha256sum --check /tmp/entremomentos-letter-preserved.sha256`: cuatro archivos OK                                                                                                            |

## Limitaciones reales

Astro dev terminó con código 1 antes de ready (`/tmp/entremomentos-letter-dev.log`). Edge headless falló con código 133 y `setsockopt: Operation not permitted` (`/tmp/letter-browser-probe.log`); Firefox también falló con código 139 (`/tmp/entremomentos-letter-firefox.log`). No hay captura válida ni comprobación HTTP/visual de las rutas. No se afirma validado responsive, clipping/overflow real, zoom, Tab nativo, lector de pantalla, interacción 3D o fluidez.

La matriz manual pendiente cubre **320 × 568, 390 × 844, 768 × 1024 y 1440 × 900**, cada uno al 100%/200%, carta larga hasta firma, teclado, Escape, scroll interno/exterior, ciclos e interrupciones, resize, movimiento reducido, sin JS e impresión. Procedimiento en [QA LetterScene](qa/letter-refinement.md), [QA Danna](qa/danna-v1.md) y decisión en [ADR 011](decisions/011-letter-reading-surface.md).

---

# Historia romántica local v1 — 2026-11-15

Estado: **implementada; `npm run verify` aprobado (código 0)**. QA visual, responsive e interacción real pendientes. Reemplaza el bloqueo de contenido/contrato documentado en la revisión anterior de esta historia.

## Cambios y preservación

Documento narrativo independiente en `src/features/story-player/local/danna-story.ts`, con los textos aprobados, carta completa y firma. `memories: []`: sin fechas, fotos ni recuerdos inventados. Story V2 se amplía de 1–100 a 0–100 recuerdos, manteniendo el array requerido y las fechas obligatorias para recuerdos reales. Las seis escenas usan el mismo renderer, con omisión genérica de listas/índices/visor cuando no hay recuerdos y párrafos separados en la introducción de Memories. No hay condicionales por destinatario.

La ruta `/para/danna/` se inyecta solo con `command === 'dev'`; entrypoint, datos y CSS quedan fuera de `pages`, `public` y las entradas públicas del player. Estilos locales reservan espacio para la carta tras la mejora cliente y añaden scroll interno al texto largo, con cierre sticky y lectura completa sin JS/impresión. No se cambia GSAP ni el controlador de la carta. La demo no carga ese CSS. Hashes de `src/pages/demo.astro` y `src/features/story-player/data/demo-story.ts` coinciden antes/después.

## Evidencia ejecutada

| Comprobación                  | Resultado                                                                                                                         |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `npm run verify`              | Código 0; log `/tmp/entremomentos-danna-verify.log`                                                                               |
| Astro check                   | 80 archivos; cero errores, warnings e hints                                                                                       |
| ESLint / Prettier             | Aprobados                                                                                                                         |
| Vitest                        | 15 archivos y 152 pruebas aprobadas, incluidas 9 nuevas de dedicatorias                                                           |
| Build                         | Solo `/` y `/demo`; sin ruta personal                                                                                             |
| `check-story-build.mjs`       | Aprobado; inspecciona todos los artefactos, incluidos source maps, y rechaza marcadores privados y CSS local                      |
| Prueba negativa de privacidad | Archivo temporal `.map` dentro de `dist` con contenido privado: rechazado; se retiró en `finally` y el gate limpio volvió a pasar |
| Hook real de configuración    | Invocado con aserciones: `dev` registra laboratorio y dedicatoria; `build` y `preview` no registran rutas locales                 |
| Preservación de demo          | `sha256sum --check /tmp/entremomentos-danna-preserved.sha256`: ambos archivos OK                                                  |
| Revisión independiente        | Revisión de código sin hallazgos materiales; no certifica aspecto ni interacción visual                                           |

La suite prueba validación V2 del documento sin recuerdos, preservación de la fixture, rechazo de recuerdos con fecha ausente/inválida, seis escenas SSR, texto completo, firma, anclas y ausencia de fechas/fotos/índices inventados. Las pruebas existentes conservan la carta cerrada al conectar, apertura, cierre, reversión, Escape, foco, limpieza y reducción de movimiento mediante dobles. No equivalen a QA de navegador de esta historia.

## Límites y continuación local

`npm run dev -- --host 127.0.0.1` termina antes de ready (código 1; `/tmp/entremomentos-danna-dev.log`). Firefox headless falla con segfault/código 139 incluso en `about:blank` (`/tmp/entremomentos-danna-firefox.log`). Curl no puede abrir socket («Operation not permitted»). No hay capturas válidas, comprobación HTTP, responsive renderizado ni interacción real aprobada. La transición inicial de HTML legible a sobre cerrado requiere revisión visual junto al scroll interno y estabilidad de layout.

Para abrir en una terminal local: `npm run dev -- --host 127.0.0.1` y visitar `http://127.0.0.1:4321/para/danna/`. No se publica el servidor dev ni se usa `noindex` como protección. Procedimiento de exclusión pública y matriz manual de responsive, carta, foco, movimiento reducido, sin JS e impresión en [QA Danna v1](qa/danna-v1.md). Decisión y reversión compatible: [ADR 010](decisions/010-local-dedications.md).

Skills aplicadas: ponytail, lean-build, migration, GSAP e impeccable. El motor de contexto de impeccable no pudo descargarse; se usó el contexto existente y revisión de código independiente, sin afirmar un gate visual aprobado. No se añadieron dependencias, fotografías o archivos personales a `public/`. No hay Git reconocible en esta copia; no se inicializó. Sin commits, push, hosting ni despliegue. La documentación final se formateó y comprobó después del gate, sin cambios de código posteriores.

---

# Incremento 1 — Tooling reproducible — 2026-11-15

Estado: **peer de TypeScript corregido, instalación limpia y verificaciones aprobadas**. La auditoría de vulnerabilidades queda pendiente por fallo DNS; ESLint 9.39.5 está fuera de soporte. No se declara cerrado M0 ni QA visual.

## Causa raíz y ajuste mínimo

Se leyeron AGENTS, arquitectura, README, package.json, lockfile, configuración ESLint y verificación previa. Se comprobaron systematic-debugging y safe-refactor en las skills globales y se aplicaron diagnóstico previo, límite de preservación y comprobación antes/después. No existe repositorio Git reconocible; no se inicializó ni se hicieron commits/push.

El manifiesto admitía typescript-eslint ^8.36.0, pero el lock fijaba 8.36.0 y su familia interna con peer TypeScript >=4.8.4 <5.9.0, incompatible con 5.9.3. El gate anterior pasaba aunque npm ls detectaba el árbol inválido: lint/build no sustituyen la comprobación de peers.

Se consultaron con npm view los metadatos reales de typescript-eslint, parser y eslint-plugin 8.72.2. Sus rangos son TypeScript >=4.8.4 <6.1.0, ESLint ^8.57.0 || ^9.0.0 || ^10.0.0 y Node ^18.18.0 || ^20.9.0 || >=21.1.0. El plugin requiere parser ^8.72.2. Se conserva TypeScript 5.9.3, ESLint 9.39.5 y Node 24.22.1; npm 12.2.2.

Cambios: package.json fija typescript-eslint 8.72.2 estable exacto; package-lock.json alinea la familia interna y elimina copias 8.36.0. Los paquetes compartidos con el lock anterior conservan sus versiones salvo typescript-eslint; las altas/bajas restantes pertenecen a su árbol transitivo. No se actualizan dependencias de aplicación. eslint.config.mjs usa defineConfig de eslint/config porque tseslint.config quedó deprecado. La configuración efectiva completa de TS, TSX y Astro, comparada mediante eslint --print-config y JSON, es idéntica antes/después de sustituir el helper. No se desactivaron reglas.

Se actualiza README para no mantener el peer antiguo como bloqueo vigente. No se modificaron fuentes, pruebas ni scripts de Landing/Player, rutas, esquemas o contenido personal.

## Evidencia real

| Comprobación                                                 | Resultado                                                                                                                                                            |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Baseline npm run verify                                      | Código 0; 143 pruebas; /tmp/entremomentos-tooling-baseline.log                                                                                                       |
| npm install --save-dev --save-exact typescript-eslint@8.72.2 | Código 0; sin force/legacy-peer-deps; /tmp/entremomentos-tooling-install.log                                                                                         |
| npm ci                                                       | Código 0; instalación limpia de 559 paquetes; /tmp/entremomentos-tooling-ci.log                                                                                      |
| npm ls --all                                                 | Código 0; sin peers inválidos; /tmp/entremomentos-tooling-tree.log                                                                                                   |
| Engines instalados                                           | 324 declaraciones comprobadas con semver contra Node 24.22.1; ninguna incompatible                                                                                   |
| ESLint efectivo TS / TSX / Astro                             | JSON idéntico tras cambiar el helper; archivos /tmp/entremomentos-eslint-before-_.json y after-_.json                                                                |
| npm run verify final                                         | Código 0; Astro check sin errores/warnings/hints, lint, formato, 143 pruebas, build y check-story-build; /tmp/entremomentos-tooling-verify.log                       |
| npm audit --json                                             | Código 1; EAI_AGAIN registry.npmjs.org al consultar advisories/bulk. Sin informe válido de vulnerabilidades; /tmp/entremomentos-tooling-audit.json y audit-error.log |

El lock contiene también sharp-win32-ia32 opcional con Node ^20.9.0: no está instalado en este host Linux y no invalida sus engines. No se declara verificada la instalación en Windows de 32 bits. El gate incluye solo / y /demo y conserva la exclusión del laboratorio en producción.

## Advertencias y pendientes

- npm ci advierte que ESLint 9.39.5 ya no tiene soporte. Se conserva para este ajuste mínimo: los plugins instalados react-hooks 5.2.0 y jsx-a11y 6.10.2 admiten hasta ESLint 9, aunque typescript-eslint 8.72.2 admita 10. Migrar ESLint y plugins requiere otro cambio coordinado; no se interpreta este aviso como vulnerabilidad confirmada.
- Repetir npm audit con DNS funcional; no se afirma que haya cero vulnerabilidades ni se ejecuta audit fix.
- Conservar Node de la rama 24 y reproducir con npm ci, npm ls --all y npm run verify. No se añadieron tests que dupliquen la implementación; se utilizaron la suite existente, peers/engines y comparación de configuración efectiva.
- Quedan registrados y **no implementados**: M2.4 (auditoría visual/funcional), navegación suave nativa, historia local para Danna, separación de builds público/personal y protección/despliegue. No hay ruta ni contenido personal nuevo, autenticación o publicación.
- Las limitaciones de navegador de los registros anteriores siguen abiertas; este incremento no requiere ni acredita QA visual.

---

# Epílogo full-bleed y cierre cinematográfico — 2026-11-15

Estado: **implementación completada y npm run verify aprobado (código 0)**. **QA visual pendiente**; no se declara clipping renderizado, suavidad o rendimiento aprobados.

## Diagnóstico y cambios

Se inspeccionaron AGENTS, README, arquitectura, ADR 008, verificación, StoryPlayer, EpilogueScene, SceneAtmosphere, layout/ruta y creadores de movimiento. El epílogo quitaba max-width pero seguía heredando el width limitado de `.story-player > *`. El radial de fondo de la sección, fuera de la máscara, reforzaba esa frontera. La causa era CSS, no GSAP.

Archivos modificados:

- `components/scenes/EpilogueScene.tsx` y `styles/player.css` de story-player: sección a 100%, ambiente separado de epilogue-content, constelación/texto acotados, radial redundante eliminado y altura natural sin mínimo 90svh. Padding inferior reducido; las escenas anteriores mantienen su geometría.
- `animations/create-epilogue-animation.ts`: reutiliza el trigger y el contexto existentes; líneas SVG escalonadas y círculos individuales coordinados. Sin pin, bucles o texto animado. Pausa/reducción restauran el estado estático completo.
- `src/components/layout/BaseLayout.astro`: slot footer con fallback original. `src/pages/demo.astro`: nota y único footer dentro de un cierre cromático CSS; el enlace Volver al comienzo permanece independiente y nativo. No se introduce GSAP en el footer.
- `tests/story-motion.test.ts`, `tests/story-photo-animation.test.ts`, `tests/story-ssr.test.ts` y `scripts/check-story-build.mjs`: propiedad/refresh de la secuencia, estrellas individuales, reversión con GSAP real sobre objetos, separación SSR y un solo footer en build.
- ADR 009 y este registro: causa, decisiones y límites. No cambian datos V2, dependencias, escenas anteriores, hooks ni el compositor de GSAP. No hay repositorio Git reconocible; sin commits/push.

Se comprobaron las seis skills solicitadas y se aplicaron sus criterios existentes en la sesión; ver [ADR 009](decisions/009-cinematic-closure.md). El observer de layout sigue refrescando los triggers propios tras resize/fuentes/imágenes; el cierre CSS no altera layout durante scroll.

## Verificación

Log del gate: `/tmp/entremomentos-epilogue-verify.log`. Código 0: Astro check (77 archivos, sin errores/warnings/hints), ESLint y Prettier, 14 archivos/143 pruebas aprobadas, build de `/` y `/demo` y check-story-build. La documentación añadida después del gate se formateó y comprobó por separado. Las pruebas de interpolación simulan progreso; no son SVG renderizado ni scroll físico. Las pruebas anteriores de pausa/reducción, imports tardíos, limpieza y otras escenas se conservan.

## Navegador pendiente

Intento actual de Edge headless: **133**, crashpad setsockopt Operation not permitted; `/tmp/entremomentos-epilogue-browser.log`. No hay captura válida. Las limitaciones previas de Firefox/dev siguen registradas abajo.

En 320, 390, 768, 1024 y 1440px: comprobar cielo hasta ambos bordes, sin corte lateral izquierdo ni scroll horizontal; constelación/texto dentro de márgenes; nota y footer legibles sin línea cromática brusca o vacío excesivo. Scroll normal/inverso y resize durante el tramo; comprobar actualización real de ScrollTrigger, pausa/reanudación, reducción inicial/en vivo, Tab y Volver al comienzo. Probar sin JS, fuentes bloqueadas y texto V2 largo; desmontar y montar para verificar recursos reales. Comparar Intro/Connection/Memories/Discovery/Letter y Landing. Todos estos escenarios visuales quedan pendientes, sin puntuación de fluidez/rendimiento.

---

# Corrección de fondos de Intro y Connection — 2026-11-15

Estado: **corrección CSS implementada y npm run verify aprobado (código 0)**. QA visual pendiente: Edge no arranca en el entorno. No se declara ausencia de overflow renderizado ni continuidad física aprobadas.

## Causa y cambio

Se inspeccionaron StoryPlayer, IntroScene, ConnectionScene, OpeningSky, CSS, creadores GSAP y observePlayerLayout, junto con AGENTS, arquitectura, ADR y verificación previos. `.story-player > *` limitaba también opening al ancho de lectura. El cielo absoluto con inset 0 se ajustaba a ese bloque; overflow clip terminaba en sus bordes y la máscara solo vertical no los disolvía. Los gradientes transparentes creaban una diferencia visible respecto al exterior: es una frontera geométrica, no un color base incorrecto.

`src/features/story-player/styles/player.css` exceptúa opening con width 100% y traslada el ancho previo a sus dos secciones. Conserva máximo 72rem, márgenes responsive, padding, tipografía, diagrama, alturas y nodos de trigger. No introduce 100vw, offsets, márgenes negativos, contención ni clipping de contenido. El cielo y sus luces ambientales siguen siendo una única superficie para ambas escenas; el stacking context existente queda intacto. Otros planos centrales conservan su ámbito y Memories no se modifica.

El wrapper ambiental cambia de ancho; observePlayerLayout ya agrupa ResizeObserver de la raíz, fuentes y cargas y refresca únicamente los ScrollTriggers propios. Se mantiene sin cambios y sus tests existentes cubren resize y limpieza. No se introducen listeners ni cálculos adicionales. Se actualizaron este registro y ADR 008; no se modificaron componentes, hooks, GSAP, datos ni dependencias. No hay repositorio Git reconocible; no se crearon commits/push.

## QA pendiente

Edge headless sobre about:blank: código 133, crashpad setsockopt Operation not permitted. Log `/tmp/entremomentos-opening-edge.log`. Sin captura válida. Los fallos históricos de Firefox/dev siguen registrados abajo; no se sustituyen por una aprobación estática.

En 320, 390, 768, 1024 y 1440px: comprobar cielo hasta ambos bordes disponibles, estrellas/nebulosas sin líneas centrales, posición del contenido idéntica, foco legible y documentElement.scrollWidth igual a clientWidth. Recorrer Intro→Connection→Memories y regresar; probar pausa/reanudación, reduced motion inicial/en vivo y resize entre tamaños. Confirmar refresh real de ScrollTrigger y continuidad del cielo sin saltos. Estos escenarios están pendientes de navegador, no probados mediante los tests numéricos.

## Verificación integrada

Log final: `/tmp/entremomentos-opening-verify.log`. Gate completo con código 0: Astro check (77 archivos, 0 errores/warnings/hints), ESLint, Prettier, 14 archivos/141 pruebas aprobadas, build de `/` y `/demo` y check-story-build. La suite conserva los casos de refresco agrupado, reversión, pausa/reducción y regresiones de Memories/visor. Tras registrar estos resultados se comprobó el formato de la documentación; no hubo cambios adicionales de código.

---

# Corrección de clipping en MemoriesScene — 2026-11-15

Estado: **geometría corregida y verificación automática aprobada**. **QA visual pendiente**: no hay navegador funcional. No se declara ausencia de clipping/overflow renderizado, foco físico o fluidez aprobados.

## Causa raíz y alcance

Se inspeccionaron AGENTS, README, arquitectura, ADR 008, verificación, MemoriesScene, StoryPlayer, SceneAtmosphere, StoryActs, BaseLayout, `/demo`, CSS de Player/Landing/global y animaciones de galería, ambiente y ampliación. Git sigue sin reconocer un repositorio; no se inicializó ninguno, ni se hicieron commits/push.

El límite provenía de `main.wrap` de BaseLayout y del `max-width: 72rem` del artículo StoryPlayer. La anulación del máximo en Memories solo llenaba a su padre. El fondo ambiental absoluto estaba dentro de esa escena central: inset 0 y overflow clip aplicaban el recorte en sus bordes; la máscara solo era vertical. La cabecera/lista y las fotos compartían ese plano sin márgenes interiores propios.

Es una causa **CSS y de composición del layout**. GSAP no limita el ancho de la escena: anima escala 0.985→1 en el reveal y escala/deriva dentro de photo-window. Ese recorte local es necesario para la deriva y se conserva, igual que el clip-path funcional del proxy de ampliación. No había contain ni transform en los ancestros del player que causaran el borde central. StoryActs solo se renderiza en Landing y sus reglas no afectan a `/demo`.

## Corrección y archivos modificados

- `src/components/layout/BaseLayout.astro`: opción genérica fullWidthContent, desactivada por defecto, independiente del modo immersive y de la feature.
- `src/pages/demo.astro`: activa el host a ancho completo y conserva el wrap de la nota de ficción.
- `src/features/story-player/components/scenes/MemoriesScene.tsx`: gallery-content contiene solo cabecera y recuerdos; atmósfera y dialog son hermanos fuera del contenedor editorial.
- `src/features/story-player/styles/player.css`: el artículo permite el ancho del host; sus hijos conservan máximo/márgenes previos. Memories ocupa 100%, su contenido usa máximo 72rem y márgenes mínimos 1.5rem/2rem/4rem para móvil/tablet/escritorio. Se disuelven los laterales del paisaje con máscara horizontal y vertical; se mantienen las columnas asimétricas existentes.
- `tests/story-ssr.test.ts`: dos regresiones para separación de planos/visor y documentos sin fotos.
- `scripts/check-story-build.mjs`: exige que el host de la demo no vuelva a envolver el player en wrap y que exista el contenedor editorial de la galería.
- `docs/decisions/008-visual-depth-photo-motion.md`, `docs/architecture/overview.md` y este registro: causa, responsabilidades y resultados.

Sin 100vw, márgenes negativos, listeners de viewport nuevos, contain, recortes globales ni cambios GSAP. No cambian StoryPlayer.tsx, las otras cinco escenas, los hooks/animaciones del player ni archivos de Landing: sus hashes se conservan en `/tmp/entremomentos-clipping-preserved.sha256` y su comprobación en `/tmp/entremomentos-clipping-preserved-check.log`. El CSS común cambia únicamente la distribución de ancho; las medidas anteriores de lectura se trasladan del host a los hijos del player.

## Resultados

Base: `npm test`, **139 pruebas aprobadas**; `/tmp/entremomentos-clipping-baseline.log`. Pruebas tras la corrección: **141 aprobadas**, `/tmp/entremomentos-clipping-tests.log`.

`npm run verify`: **código 0**; `/tmp/entremomentos-clipping-verify.log`. Incluye Astro check (0 errores/warnings/hints), ESLint, Prettier, 14 archivos/141 pruebas, build de `/` y `/demo`, y validación de HTML/artefactos. Se mantienen las pruebas de scroll inverso simulado, propiedad/limpieza GSAP, ampliación, Escape/foco solicitados, interrupciones, proporciones y reducción. Las nuevas aserciones SSR/build prueban estructura y contenido; no sustituyen layout computado o interacción real.

## Navegador y escenarios pendientes

- Edge headless: **133**, crashpad setsockopt Operation not permitted; `/tmp/entremomentos-clipping-edge.log`.
- Firefox headless: **139**, segmentation fault; no hay captura válida; `/tmp/entremomentos-clipping-firefox.log`.
- `npm run dev -- --host 127.0.0.1`: **1**, Dev server process exited before becoming ready; `/tmp/entremomentos-clipping-dev.log`.

| Ancho  | Inspección visual pendiente                                                                   |
| ------ | --------------------------------------------------------------------------------------------- |
| 320px  | Una columna, márgenes de 24px, foto/créditos y foco sin recorte; sin scroll horizontal.       |
| 390px  | Una columna con contenido largo, paisaje continuo y laterales disueltos.                      |
| 768px  | Columnas editoriales alternas, margen mínimo 32px y texto antes de foto en orden DOM.         |
| 1024px | Margen mínimo 64px, columnas asimétricas y fondo fuera del ancho editorial.                   |
| 1440px | Fondo hasta los bordes disponibles; contenido máximo 72rem, sin línea de corte en ese máximo. |

En cada ancho: scroll normal e inverso, pausa/reanudación, movimiento reducido inicial/en vivo, Ampliar→Cerrar y Escape con foco, resize durante la transición, textos/imágenes verticales y horizontales. Comparar Intro, Connection, Discovery, Letter, Epilogue y Landing; mantener consola abierta. Quedan pendientes el responsive renderizado, la continuidad física del fondo/visor y la ausencia real de overflow; no se extrapolan de los tests numéricos ni de los hashes.

---

# Verificación M2.2.1 — 2026-11-15

Estado: **profundidad ambiental y transición fotográfica implementadas; `npm run verify` aprobado (código 0)**. **QA visual, teclado nativo y rendimiento pendientes**: los navegadores y Astro dev no arrancan en este entorno. No se declara fluidez ni composición renderizada aprobadas.

## Alcance y diagnóstico

Se leyeron AGENTS, README, arquitectura, ADR 004/005/006/007, verificación, escenas, visor, preferencias, creadores GSAP y pruebas antes de editar. La revisión de fuentes se identifica con hashes en `/tmp/entremomentos-m221-source-sha256.txt`. La copia recibida ya contiene M2.3: se preserva sin añadir interacciones nuevas. No hay repositorio Git reconocible; no se inicializó ninguno ni se hicieron commits/push. No cambian contrato/datos V2, Landing, dependencias ni lockfile.

La ampliación abrupta se explica en el código: una segunda imagen se montaba a tamaño final y se abría con showModal sin medir el origen ni mantener un elemento durante la salida. El backdrop era inmediatamente opaco. Se implementa FLIP manual con GSAP existente, recorte explícito y escala uniforme, transición de 560 ms y conservación de la selección hasta completar el cierre. Evaluación de GSAP Flip, propiedad y decisiones en [ADR 008](decisions/008-visual-depth-photo-motion.md).

## Resultados integrados

Base: `npm test`, **13 archivos y 113 pruebas aprobadas**, log `/tmp/entremomentos-m221-baseline.log`. Implementación final: `npm run verify`, **código 0**, log `/tmp/entremomentos-m221-verify.log`.

| Comprobación      | Resultado                                                                                     |
| ----------------- | --------------------------------------------------------------------------------------------- |
| Astro check       | 77 archivos; 0 errores, warnings o hints                                                      |
| ESLint / Prettier | Aprobados                                                                                     |
| Vitest            | 14 archivos, 139 pruebas aprobadas                                                            |
| Build             | Estático: `/` y `/demo`                                                                       |
| check-story-build | Seis escenas, narrativa SSR, anclas, Landing y exclusión del laboratorio/validación aprobadas |

La primera iteración de pruebas detectó una aserción que consultaba un spy después de restaurarlo. Se conserva la referencia de timeline antes de limpiar para comprobar su retirada real; no se desactivaron pruebas/reglas. La revisión posterior añadió limpieza si falla la primera medida del destino y protección inert durante preparación para evitar alcanzar créditos invisibles. Los enlaces de crédito no se desvanecen con el texto durante la transición.

## Evidencia y límites

- **Visor con dobles DOM:** preparación/decodificación, apertura, botón, cancel nativo que representa Escape, retención del diálogo durante salida y foco inicial/final solicitado con preventScroll. No demuestra Tab/Escape físicos ni contención nativa real.
- **Interrupciones:** intención más reciente durante apertura/salida, cierres repetidos, finalizaciones obsoletas ignoradas, cierre nativo inesperado y diez ciclos interrumpidos. La selección se invalida al sustituir el array aunque los ids coincidan. Se conserva navegación nativa con modificadores o sin soporte de dialog.
- **Preferencias y errores:** reduce inicial sin importar GSAP, cambios durante ambas direcciones, sin repetir entrada al volver a no-preference; descarte de import y decode tardíos; visor estático ante errores de import, decodificación o geometría, incluyendo fallo parcial. La pausa decorativa no controla el estado del visor.
- **Geometría y GSAP real:** pruebas numéricas de proporciones 640×423, 423×640, 1200×300 y 300×1200, recorte de deriva/hover, escala uniforme, extremos, interrupciones desde progreso parcial, resize y nueva medida del origen. Reversión efectiva de propiedades sobre objetos numéricos y retirada de timelines/proxy. No son DOM pintado, clip-path renderizado ni prueba física de suavidad.
- **Ambiente:** SSR de cinco planos compartidos, cielo determinista al inicio/final y fotografía reutilizada sin duplicar imágenes narrativas. Timelines dentro del matchMedia existente, scrub reversible sin pin, refresco propio y reversión también ante fallo parcial. Una prueba con GSAP real avanza y retrocede progreso numérico hasta recuperar los mismos valores; no se presenta como scroll físico.
- **Limpieza:** listeners de cancel/close/click, resize/visualViewport/scroll interno, ResizeObserver, frames agrupados y cancelados, contexto y promesas tardías. Se conservan contratos, navegación, carta, apertura, galería y Landing.

El paisaje ambiental toma una foto del documento; no se añadieron URLs ni assets nuevos. La demo reutiliza sus WebP. No se ha medido red, rasterización, CLS/LCP, GPU o consumo en dispositivo. Un documento con URLs externas sigue dependiendo de que su productor entregue imágenes optimizadas.

## Intentos de navegador

- Edge headless sobre about:blank con no-sandbox/crash reporter desactivado: **133**, crashpad setsockopt Operation not permitted. Log `/tmp/entremomentos-m221-browser.log`.
- Firefox headless con screenshot: **139**, segmentation fault; sin captura válida. Log `/tmp/entremomentos-m221-firefox.log`.
- `npm run dev -- --host 127.0.0.1`: **1**, Dev server process exited before becoming ready. Log `/tmp/entremomentos-m221-dev.log`.
- Impeccable context: **127**, no pudo descargar engine 0.1.18. Se consultaron directamente el contexto y las referencias locales; no se instaló ni se declara su detector/gate aprobado.

Pendientes reproducibles en [protocolo M2.2.1](qa/m221-browser.md): captura/vídeo de ambas direcciones y recorte real, hover/deriva al ampliar, resize/orientación/zoom, móvil/poca altura, foco nativo/Tab/Escape, scroll inverso, pausa, reducción en vivo, fuentes/fotos bloqueadas, hidratación y diez desmontajes. Se conservan los pendientes históricos siguientes. La rúbrica de Motion Director no asigna puntuación a categorías no observadas.

## Entrega

Nuevos: SceneAtmosphere, create-atmosphere-animation, create-photo-animation, photo-geometry, pruebas story-photo-animation, ADR 008 y protocolo M2.2.1. Actualizados: visor/hook, composición ambiental de las escenas, compositor/motion, CSS, pruebas SSR/visor/motion, README, arquitectura, ADR 006 y este registro. Skills aplicadas y conflictos resueltos a favor del brief se detallan en ADR 008.

---

# Verificación M2.3 — 2026-11-15

Estado: **Discovery, Letter y Epilogue implementadas; gate integrado aprobado durante la implementación (113 pruebas)**. **Aceptación visual y de teclado/scroll real pendiente**: Edge/Firefox y el servidor de desarrollo no arrancan. No se declara suavidad física ni responsive renderizado aprobados.

## Inspección y alcance real

Se leyeron AGENTS, README, arquitectura, ADR 001–006, fundamentos, verificación, contrato V2, componentes, hooks y pruebas. M2.0 tiene seis escenas SSR, navegación y contrato V2; M2.1 tiene apertura y constelación; M2.2 sí tiene galería editorial y visor opcional. Sus pendientes visuales históricos se conservan abajo. El gate de base pasó completo con 95 pruebas, log `/tmp/entremomentos-m23-baseline.log`.

Se presentó el plan antes de editar. Se mantienen datos/contrato Zod, entradas públicas, independencia de Landing y dependencias/lockfile. Git no reconoce un repositorio en el directorio; no se inicializó ni se hicieron commits/push. Skills y decisiones en [ADR 007](decisions/007-lasting-memories.md).

## Verificación integrada

`npm run verify`: gate completo ejecutado sobre implementación, pruebas y documentación de diseño/arquitectura; **código 0**, log `/tmp/entremomentos-m23-verify.log`. Tras una revisión de orden de foco/inert y el registro de QA se ejecuta de nuevo el mismo gate; el log indicado corresponde a la última ejecución.

| Comprobación      | Resultado                                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| Astro check       | 72 archivos; 0 errores, 0 warnings, 0 hints                                                               |
| ESLint / Prettier | Aprobados                                                                                                 |
| Vitest            | 13 archivos, 113 pruebas aprobadas (18 nuevas)                                                            |
| Build             | Estático, únicamente `/` y `/demo`                                                                        |
| check-story-build | Seis escenas, narrativa SSR, anclas, Landing y exclusión de laboratorio/validación del renderer aprobadas |

En iteración se actualizaron las aserciones anteriores de cantidad de anclas y paths para incluir los nuevos destinos/epílogo sin perder la comprobación de apertura. Una prueba de texto largo comparaba el texto antes de trim con el documento Zod normalizado; se corrigió para comprobar el contenido validado. No se desactivaron pruebas ni reglas.

## Qué demuestra la evidencia

- Carta: cuatro estados, apertura/cierre, intención síncrona ante clics rápidos, cierres repetidos, Escape acotado a la región y peticiones de foco con preventScroll. El controlador usa dobles DOM/EventTarget; no prueba foco real o activación predeterminada de Enter/Espacio.
- GSAP real: tres pruebas sobre objetos numéricos comprueban play/reverse desde progreso parcial, inversiones en ambos sentidos, extremos inmediatos y restauración al revertir durante animación. No son transformaciones CSS, DOM renderizado ni prueba de suavidad.
- Preferencias: reducción inicial sin importar GSAP, cambios con carta abierta/durante ambas transiciones, reutilización de import pendiente, descarte de generaciones tardías, fallback ante import/inicialización fallidos y diez limpiezas interrumpidas. La pausa decorativa y los eventos de scroll/rueda positivos/negativos no controlan la carta; esos eventos sintéticos no demuestran scroll físico.
- SSR: una sola carta completa, firma V2 única, artículo inicialmente sin hidden/inert, controles de mejora ocultos y semántica nativa de botones. Narrativa de los tres actos finales con párrafos largos, palabra sin espacios y firma de 120; ids de recuerdos arbitrarios enlazados mediante destinos seguros. Se conservan todas las pruebas anteriores de escenas, contratos, medios, visor y Landing.
- Epílogo: propiedad de su timeline decorativo, paths normalizados, scrub reversible sin pin, texto fuera de GSAP y refresh limitado al trigger propio junto con los anteriores.

El papel tiene altura natural y quiebres de palabras; las reglas responsive se implementaron, pero **no se ha verificado su renderizado**. El build prueba disponibilidad de contenido sin JS; no una lectura visual real con scripts desactivados. Los escenarios manuales reproducibles para responsive, textos largos, teclado, scroll normal/inverso, pausa, desmontaje y regresión están en [protocolo M2.3](qa/m23-browser.md), todos pendientes en navegador.

## Intentos de QA visual y bloqueos

- Edge headless sobre about:blank con no-sandbox, disable-dev-shm-usage, crash reporter/breakpad desactivados: **133**, crashpad setsockopt Operation not permitted. `/tmp/entremomentos-m23-browser.log`.
- Firefox headless con screenshot sobre about:blank: **139**, segmentation fault; sin captura válida. `/tmp/entremomentos-m23-firefox.log`.
- `npm run dev -- --host 127.0.0.1`: **1**, Dev server process exited before becoming ready. `/tmp/entremomentos-m23-dev.log`.
- Impeccable context: **127**, no pudo descargar engine 0.1.18; referencias locales y contexto del proyecto consultados directamente. No se aprueba su detector/gate visual.

No existen capturas de esta entrega ni se asignan notas de suavidad, rendimiento o composición. Falta observar la salida/oclusión del papel, inversión efectiva de estilos, foco, responsive a 320/390/768/1024/1440px y poca altura, zoom, scroll real, hidratación y dispositivo móvil. El peer de tooling y pendientes anteriores siguen fuera del alcance.

## Entrega

Nuevos: `hooks/use-letter.ts`, `animations/create-letter-animation.ts`, `animations/create-epilogue-animation.ts`, pruebas `story-letter` y `story-letter-animation`, ADR 007 y protocolo de navegador. Actualizados: escenas finales, destinos de Memories, StoryPlayer, compositor GSAP, motion.ts, player.css, SSR/motion tests, README, arquitectura, fundamentos y este registro.

---

# Verificación M2.2 — 2026-11-15

Estado: **galería editorial y ampliación opcional implementadas; `npm run verify` aprobado completo (código 0)**. **Aceptación visual y de interacción real pendiente** por fallos de los navegadores y de Astro dev en este entorno. No se declara fluidez, top layer, teclado real, responsive renderizado ni rendimiento aprobados.

## Resultados reales M2.2

Se inspeccionaron AGENTS, README, arquitectura, ADR 004/005, fundamentos, verificación, escenas, animaciones, hooks y pruebas antes de implementar. La verificación base pasó completa con 78 pruebas. No hay repositorio Git reconocible; no se inicializó ninguno ni se hicieron commits/push. Se conservan dependencias, package.json y lockfile.

`npm run verify` final: **código 0**; log en `/tmp/entremomentos-m22-verify.log`. Incluye tipos, lint, formato, pruebas, build y check-story-build.

| Comprobación      | Resultado                                                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| Astro check       | 67 archivos; 0 errores, 0 warnings, 0 hints                                                                    |
| ESLint            | Aprobado                                                                                                       |
| Prettier          | Todos los archivos aprobados                                                                                   |
| Vitest            | 11 archivos, 95 pruebas aprobadas                                                                              |
| Build estático    | Aprobado; únicamente `/` y `/demo`                                                                             |
| check-story-build | Escenas SSR en orden, narrativa, anclas, Landing y exclusión del laboratorio/validación del renderer aprobados |

Las comprobaciones focalizadas de SSR, movimiento, viewer y geometría también pasaron. Una revisión posterior sustituyó la traslación de entrada de fotos por escala 0.985→1 para evitar invadir créditos durante el scrub; se repitió la verificación completa. El hover requiere no-preference también por CSS, para respetar reducción antes de hidratar o sin JavaScript. No se desactivaron pruebas ni reglas.

## Evidencia y límites

- Galería SSR: orden editorial, fechas ISO con presentación española/UTC, fotos con dimensiones y créditos, recuerdos sin imagen y cantidades variables. Los tres enlaces de foto son nativos y tienen nombres de ampliación; existe un único visor cerrado sin duplicar imágenes antes de interactuar. Todo mensaje permanece disponible sin abrirlo.
- Movimiento: 1/12/100 fotos producen timelines propios en orden, con texto ajeno a GSAP, opacidad inicial legible, geometría estable, scrub reversible y sin pin. Reversión solicitada ante fallo parcial en una foto. Se conservan las pruebas anteriores de reducción, pausa, imports tardíos y diez montajes.
- Layout: fuentes, cargas, errores y resize comparten un frame; solo se refrescan triggers propios de apertura y galería. Cancelación de frame, listeners y observer; descarte de fuentes y resize tardíos tras limpieza.
- Viewer: apertura solicitada, bloqueo/restauración del overflow previo, scroll instantáneo al punto guardado y foco con preventScroll. Preserva modificadores y navegación sin soporte de dialog. Invalida selección al sustituir documento aunque conserve ids, limpia diez ciclos y tolera un enlace desmontado.

Los tests usan harness de efectos React y dobles de GSAP/navegador: **no son hidratación ni montaje DOM real**. No demuestran contención de foco nativa, Escape real, top layer, restauración visual del scroll, reversión efectiva de estilos o suavidad de ScrollTrigger. El HTML de build demuestra presencia de contenido, no una sesión renderizada sin JavaScript.

## Intentos de navegador y pendientes

- Edge headless sobre about:blank, sin sandbox y con crash reporter desactivado: código 133; crashpad setsockopt Operation not permitted. Log: `/tmp/entremomentos-m22-browser.log`.
- Firefox headless sobre about:blank: código 139 (segmentation fault); sin captura válida. Log: `/tmp/entremomentos-m22-firefox.log`.
- `npm run dev -- --host 127.0.0.1`: código 1, Dev server process exited before becoming ready. Log: `/tmp/entremomentos-m22-dev.log`.
- Impeccable context: no pudo descargar engine 0.1.18; se consultaron documentos y referencias locales. No se declara detector ni gate visual aprobados.

En navegador funcional: revisar 320/390/768/1024/1440px, poca altura, orientación, zoom 200%, texto largo, imágenes verticales y fallidas, fuentes bloqueadas, scroll rápido/ida/vuelta y recarga intermedia. Probar ampliación por teclado/touch, foco inicial/Tab/Escape/cierre, créditos, restauración de posición y diez ciclos reales. Repetir con pausa, reducción inicial/en vivo y JS desactivado; confirmar que avanzar no depende del visor. Medir CLS/LCP y fluidez en móvil. Los fallbacks de fuentes y el bloqueo de scroll del dialog requieren observación en móvil real. No se asignan puntuaciones de timing/performance sin evidencia visual.

## Entrega y alcance

Nuevos: `hooks/use-memory-viewer.ts`, `animations/create-memories-animation.ts`, `animations/observe-player-layout.ts` dentro de story-player; `tests/story-memory-viewer.test.ts`, `tests/story-layout.test.ts` y [ADR 006](decisions/006-living-memories.md).

Actualizados: MemoriesScene, StoryPhoto, compositor GSAP, motion.ts, player.css, pruebas story-motion/story-ssr, README, arquitectura, fundamentos y este registro. Se conserva la apertura M2.1 y las tres escenas finales mantienen su composición para M2.3. El peer previo de tooling de M0 y las revisiones históricas pendientes permanecen fuera del alcance.

Skills aplicadas: design-taste-frontend, ui-ux-pro-max, Impeccable, motion-director, GSAP y Ponytail. ADR 006 documenta aportes y conflictos resueltos a favor del brief y la identidad existente.

---

# Verificación M2.1 — 2026-11-15

Estado: **apertura de Intro/Connection implementada y `npm run verify` aprobado completo (código 0)**. **Validación visual y de interacción real pendiente**: no se pudo utilizar navegador ni arrancar el servidor de desarrollo en este entorno. No se declara aceptación visual, ausencia de overflow renderizado ni fluidez aprobadas.

## Resultados reales M2.1

Se leyeron AGENTS, README, arquitectura, ADR 004, fundamentos y verificación; se inspeccionaron contrato V2, escenas, hooks, pruebas y GSAP de Landing/Player. El gate base también pasó completo (71 pruebas). No hay repositorio Git reconocible en el directorio; no se inicializó ninguno ni se hicieron commits/push. No se añadieron dependencias ni se modificaron package.json o package-lock.json.

`npm run verify` final: **código 0**; log de esta sesión en `/tmp/entremomentos-m21-verify.log`. Ejecutado después de las escenas, animaciones, estilos, pruebas, README, arquitectura, fundamentos y ADR 005. Este registro se añadió después y se comprobó su formato por separado.

| Comprobación      | Resultado                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Astro check       | 62 archivos; 0 errores, 0 warnings, 0 hints                                                                                           |
| ESLint            | Aprobado                                                                                                                              |
| Prettier          | Todos los archivos aprobados                                                                                                          |
| Vitest            | 9 archivos, 78 pruebas aprobadas                                                                                                      |
| Build estático    | Aprobado; únicamente `/` y `/demo`                                                                                                    |
| check-story-build | Seis escenas SSR en orden, narrativa, anclas, cuatro anclajes/CTA de Landing y exclusión del laboratorio y Zod del renderer aprobados |

En iteración se corrigieron dos aserciones nuevas: una intentaba inspeccionar un spy de ScrollTrigger en el timeline temporizado, que no tiene trigger; otra asumía atributo data vacío cuando React lo serializa como true. Un gate intermedio se detuvo por formato de esa prueba; se formateó y el gate final pasó sin desactivar reglas ni pruebas.

## Qué prueban las comprobaciones

- SSR: cielo determinista en renders sucesivos, dos luces y geometría terminada, decoración aria-hidden, texto y enlaces visibles antes de JavaScript, un h1 y seis escenas. Se añade un documento familiar con varios párrafos y contenido largo; la apertura no fija participantes ni depende de la fixture.
- Animación: timelines acotados a Intro/Connection, scrub reversible configurado, sin pin ni mutación de párrafos/enlaces, título nunca oculto, entrada una sola vez y omitida fuera de pantalla, paths normalizados para el trazado, reversión propia también ante fallo parcial.
- Geometría: refresco únicamente de los dos triggers propios tras fonts.ready y descarte de la continuación después de limpiar. Sin listener de scroll ni medición por frame.
- Ciclo de vida previo conservado: cambio rápido de movimiento reducido, imports tardíos, pausa independiente, documento sustituido con el mismo id, errores y diez montajes/desmontajes. Se mantienen las pruebas de anclas, contrato, medios y Landing.

Los tests de movimiento siguen usando dobles de GSAP/React/navegador. Acreditan las llamadas y las carreras del efecto; **no demuestran la reversión real de estilos, hidratación, desplazamiento físico, teclado ni ScrollTrigger en navegador**. La inspección del HTML generado verifica disponibilidad del contenido sin JavaScript; no sustituye una lectura renderizada con JS desactivado.

## Navegador y aceptación pendiente

Intentos reales de esta sesión:

- `/opt/microsoft/msedge/msedge --headless --no-sandbox --disable-dev-shm-usage --disable-crash-reporter --disable-breakpad --dump-dom about:blank`: código 133; crashpad setsockopt: Operation not permitted.
- `firefox --headless --screenshot /tmp/entremomentos-m21-browser-probe.png about:blank`: código 139; no produjo captura válida.
- `npm run dev -- --host 127.0.0.1`: código 1; Dev server process exited before becoming ready.
- Impeccable context: código 127; no se pudo descargar engine 0.1.18 por restricciones de red. Se consultaron directamente las referencias locales y los documentos existentes; no se instaló el motor.
- Consulta del gate de design-taste desde `/tmp`: `GATE: OFF (no build active)`. No se presenta como auditoría visual aprobada ni se importó su kit comercial al player.

Pendiente en navegador habilitado: 320/390/768/1024/1440px, escritorio con poca altura, móvil real y orientación, zoom 200%, fuentes bloqueadas, contraste junto a halos, foco de teclado/skip/anclas, ausencia de overflow y superposiciones, entrada de Intro, constelación en ida/vuelta y scroll rápido, recarga con hash intermedio, pausa/reanudación, preferencia reducida en vivo, JS desactivado y diez montajes con reversión real de estilos/triggers. Medir LCP, CLS y fluidez móvil. No se asignan puntuaciones de timing o performance sin observación.

Riesgos acotados: las fuentes externas y sus fallbacks pueden alterar los saltos y la altura; fonts.ready refresca triggers pero falta observar el resultado. La pausa restaura el estado estático terminado, conforme al contrato previo, y no congela un fotograma intermedio. Las otras cuatro escenas conservan su composición básica y requieren los hitos posteriores. El peer de tooling de M0 y los pendientes históricos de M1.1 no forman parte de esta entrega.

## Archivos entregados

Modificados:

- `src/features/story-player/components/StoryPlayer.tsx`
- `src/features/story-player/components/scenes/IntroScene.tsx`
- `src/features/story-player/components/scenes/ConnectionScene.tsx`
- `src/features/story-player/animations/create-player-animation.ts`
- `src/features/story-player/animations/motion.ts`
- `src/features/story-player/styles/player.css`
- `src/pages/demo.astro`
- `tests/story-motion.test.ts`
- `tests/story-ssr.test.ts`
- `README.md`
- `docs/architecture/overview.md`
- `docs/design-system/foundations.md`
- `docs/verification.md`

Nuevos:

- `src/features/story-player/components/OpeningSky.tsx`
- `src/features/story-player/components/ConnectionConstellation.tsx`
- `src/features/story-player/animations/create-intro-animation.ts`
- `src/features/story-player/animations/create-connection-animation.ts`
- `docs/decisions/005-cinematic-opening.md`

Skills aplicadas: design-taste-frontend, ui-ux-pro-max, Impeccable, motion-director, GSAP y Ponytail. Sus aportes y los conflictos resueltos a favor del brief/identidad están en [ADR 005](decisions/005-cinematic-opening.md).

---

# Verificación M2.0 — 2026-11-15

Estado: **M2.0 implementado y `npm run verify` aprobado completo**, incluido el nuevo gate de artefactos. **Validación visual y de navegador pendiente**. M0 sigue abierto por su peer previo y pruebas manuales; los pendientes de M1.1 se conservan abajo como historial.

## Resultados reales

Se inspeccionaron AGENTS, README, arquitectura, decisiones, contratos, demo, landing y verificación antes de editar. El gate base pasó en la auditoría previa: 14 pruebas y build de dos rutas. Git no reconoce un repositorio en este directorio; no se inicializó ni se hicieron commits/push. No se instalaron dependencias ni se cambió el lockfile. Solo cambió el script verify en package.json.

Gate integrado final: `npm run verify`, código 0, ejecutado después de completar implementación, pruebas, ADR, README, arquitectura y fundamentos visuales. Este registro de resultados se añadió después del gate y se verificó su formato por separado.

| Comprobación                         | Resultado                                                                                                 |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Astro check                          | 58 archivos; 0 errores, 0 warnings, 0 hints                                                               |
| ESLint                               | Aprobado                                                                                                  |
| Prettier                             | Todos los archivos aprobados                                                                              |
| Vitest                               | 9 archivos, 71 pruebas aprobadas                                                                          |
| Build estático                       | Aprobado; solamente `/` y `/demo`                                                                         |
| `node scripts/check-story-build.mjs` | Seis escenas SSR en orden, narrativa, anclas, estructura de landing y exclusión del laboratorio aprobados |

El gate de artefactos forma parte de verify, después del build. Inspecciona el HTML real generado: Intro, Connection, Memories, Discovery, Letter y Epilogue presentes en orden, mensajes de recuerdos y carta presentes, y todos los enlaces de fragmento de demo con destino existente. Confirma los cuatro anclajes del bosque y el CTA a demo en la portada. Inspecciona HTML/JS/CSS públicos: sin ruta dev, chunks create-demo-animation, interfaz técnica ni estilos memory-stage; tampoco encuentra código de validación Zod en el JavaScript del renderer. Esto acredita estructura generada, no interacción o composición renderizada.

## Cobertura y correcciones durante la implementación

- Contratos: V1 conservado con sus seis pruebas; V2 con versión literal, escenas obligatorias, fechas reales, ids únicos, texto vacío/largo, tema y límites de recuerdos. Los casos de amistad, familia, pareja y barrio no requieren roles de relación.
- Medios: fuentes locales absolutas y HTTPS válidas; rechazo de protocolos y fuentes inseguros, alt vacío, dimensiones inválidas y créditos con enlaces inválidos.
- SSR: narrativa completa sin APIs del navegador, un h1, seis escenas en orden, anclas con títulos enfocables, retorno a Intro, créditos y dimensiones; fotografías opcionales mezcladas y 1/12/100 recuerdos enteramente textuales. React escapa el texto en lugar de interpretarlo como HTML.
- Movimiento: creador GSAP acotado al acento propio, reduced motion e inicialización parcial fallida con reversión. Harness de efectos del hook: arranque reducido, cambios rápidos, import tras desmontaje, pausa manual preservada al cambiar preferencias, cambio de documento con igual id, fallo de inicialización y diez ciclos de limpieza. Se conserva la disponibilidad del control al pausar/reanudar, evitando ocultarlo durante cada reconstrucción.
- Navegación: observer propio, escena activa, franja calculada con altura del viewport, reconstrucción en resize, retirada de listener y observer, descarte de callbacks tras desmontar y fallback sin IntersectionObserver. El hook no depende de la pausa decorativa.
- Landing: las ocho pruebas existentes de ambiente/geometría siguen pasando. Sus componentes, hooks y animaciones no se editaron. Solo se retiraron de global.css los estilos exclusivos del laboratorio, ahora en dev/styles. La inspección del build conserva sus cuatro anclajes, hero y CTA; no demuestra ausencia de regresiones visuales.

El primer build con getStaticPaths vacío seguía incluyendo JavaScript del laboratorio. Se sustituyó por una inyección de ruta exclusivamente en astro dev, con el entrypoint fuera de pages. La separación de index.ts y document.ts retiró del bundle del renderer la validación y fixture de ejemplo. El primer test de preferencias rápidas evidenció continuaciones pendientes de imports concurrentes del mismo módulo; se compartió una promesa por efecto, manteniendo el descarte de generaciones, y la prueba pasó. No se desactivaron pruebas o reglas.

Los tests de ciclo de vida usan dobles de React, GSAP y navegador en Vitest node. Comprueban las operaciones solicitadas y las carreras del efecto; **no son un montaje React en DOM, una hidratación real ni una prueba de reversión de estilos con ScrollTrigger en navegador**.

## Navegador y pendientes

Intentos realizados en esta implementación:

- `microsoft-edge --headless --no-sandbox --disable-dev-shm-usage --disable-crash-reporter --disable-breakpad --dump-dom about:blank`: código 133, crashpad setsockopt Operation not permitted.
- `firefox --headless --screenshot /tmp/entremomentos-m20-browser.png about:blank`: código 139; no produjo una captura válida.
- `npm run dev -- --host 127.0.0.1`: código 1, Dev server process exited before becoming ready. La ruta `/dev/gsap` está configurada y excluida de producción; no se pudo ejercitar por HTTP en este entorno.
- Motor Impeccable no disponible en la auditoría previa. Se aplicaron sus referencias y el contexto del proyecto; no se instaló ni se afirma detector/revisión visual aprobados.

Por tanto **no se aprueban** screenshots, contraste renderizado, teclado/touch reales, hidratación, responsive visual, LCP/CLS/FPS ni suavidad de GSAP. El contenido SSR y los destinos de ancla se verificaron mediante pruebas y artefactos, no mediante navegación de usuario.

Pendiente en un entorno funcional: 320/390/768/1024/1440px, ventanas bajas, zoom 200%, scroll ida/vuelta y rápido, recarga con hash intermedio, foco visible y teclado/touch; pausar sin bloquear enlaces; reduced motion inicial y en vivo conservando pausa manual; JS desactivado, fuentes bloqueadas e imágenes fallidas; diez montajes/desmontajes reales sin recursos acumulados; comprobar `/dev/gsap` en desarrollo y su ausencia en preview; medir rendimiento en móvil. Resolver el peer typescript-eslint 8.36.0 / TypeScript 5.9.3 por separado antes de cerrar M0.

## Archivos afectados y alcance

- Rutas/configuración: `src/pages/demo.astro`, `astro.config.mjs`, `package.json`; nuevo `scripts/check-story-build.mjs`.
- Contratos/contenido: `story-player/schemas/story.ts`, nuevo `schemas/media.ts`, `data/demo-story.ts`, nuevo `data/scenes.ts`, `index.ts` y nuevo `document.ts`.
- Renderer nuevo: `components/StoryPlayer.tsx`, `StoryNavigation.tsx`, `StoryPhoto.tsx` y las seis escenas bajo `components/scenes/`.
- Navegador/presentación nuevos: `hooks/use-story-motion.ts`, `hooks/use-story-navigation.ts`, `animations/create-player-animation.ts`, `animations/motion.ts` y `styles/player.css`.
- Laboratorio: se trasladaron MotionDemo, su hook, animación, parámetros, contrato V1, fixture e index a `story-player/dev/`; se añadieron `dev/lab.astro` y `dev/styles/demo.css`. Los estilos técnicos salieron de `src/styles/global.css`.
- Pruebas: actualizado `tests/story.test.ts`; nuevos `story-v1`, `story-media`, `story-ssr`, `story-motion`, `story-motion-lifecycle` y `story-navigation`, todos con sufijo `.test.ts`. Las pruebas de landing y geometría se conservaron.
- Documentación: `README.md`, este registro, `docs/architecture/overview.md`, `docs/design-system/foundations.md` y nuevo [ADR 004](decisions/004-story-player.md).

Las rutas de la feature de este inventario son relativas a `src/features/story-player/`. No se implementaron las coreografías de M2.1–M2.3, editor, servicios externos, autenticación, APIs ni publicación real.

Skills: Ponytail, Lean Build, Clean/Hexagonal para límites, Impeccable, Frontend Atlas, Motion Director, GSAP e Investigate First; revisión crítica durante la planificación. No hubo instalación de skills, commits ni push.

---

# Verificación M1.1 — histórico anterior a M2.0

## Base verificable

Antes de modificar componentes: `npm run verify` aprobado completo; `npm ls --depth=0` aprobado; `npm ls --all` sigue con ELSPROBLEMS por typescript-eslint 8.36.0 / TypeScript 5.9.3. Se conservaron package.json y lockfile. M0 permanece abierto por peer previo y validación manual pendiente. Git no reconoce un repositorio en la ruta; no se inicializó ni se crearon commits/push.

## Cinco incrementos

1. Base: gates aprobados antes de editar; skills e instrucciones/documentos revisados. Edge headless vuelve a fallar código 133, crashpad setsockopt EPERM.
2. Cuatro actos estáticos: Astro check aprobó 28 archivos sin diagnósticos. Contenido semántico, paisajes de ejemplo, constelación y carta en SSR; crédito corregido.
3. Continuidad: verify completo aprobado después de crear proxy, interpolación y pin; nueve pruebas existentes aprobadas.
4. Carta/ambiente/pausa: control disponible durante recorrido, anclaje visual conservado, puntero inicial y viaje móvil. Se añadieron cinco pruebas matemáticas; verify aprobó 14 pruebas.
5. Optimización/documentación: variantes WebP, medidas fuera del frame, CSS sin clipping en ancestro del pin, revisión de código independiente y gate final. Resultados finales de check, lint, formato, Vitest y build registrados en el informe de entrega.

## Evidencia de transiciones y límites

`tests/story-geometry.test.ts`: coincidencia exacta de anclajes en ambos sentidos; coordenada vertical de viewport constante durante el pin; continuidad a ±0.001px de sus límites; overscroll y conjunto vacío; configuración de breakpoint/pin. Son pruebas de matemáticas, no una grabación ni integración DOM. Las tres pruebas anteriores de ambiente y seis del contrato se mantienen.

Implementación: cuatro anclajes forest-anchor y un proxy aria-hidden. Transferencia hero → recuerdo → constelación → carta; móvil mantiene esa trayectoria sin pin. Originales estáticos visibles sin JS/reduced motion. Un solo sitio crea pin, limitado a ancho >=1024 y alto >=720. Revisión independiente confirmó correcciones de clipping y anclaje de carta; la referencia del panel de lectura se corrigió tras su último hallazgo.

No hay evidencia visual aprobada: Edge no arranca (133), Firefox segfault (139) incluso about:blank; `npm run dev -- --host 127.0.0.1` sale antes de ready (1). No se generaron capturas válidas. Motor Impeccable no descargable; no se afirma detector aprobado. No se han medido FPS, LCP, CLS, interacción real de teclado o cambios de breakpoint en navegador. **No se declara la experiencia lista para portafolio.**

Pendiente en entorno con navegador: 320/390/768/1024/1440px, ventanas bajas, zoom 200%, contraste renderizado, scroll ida/vuelta y rápido, recarga intermedia, enlaces internos, pausa durante pin, resize/orientación, reduced motion en vivo, JS desactivado, montaje/desmontaje repetido y red de fuentes bloqueada. Capturar los cuatro anclajes y puntos intermedios y grabar ida/vuelta antes de aprobar continuidad visual. Revisar compresión de variante grande y medir rendimiento en móvil real.

Arquitectura y decisiones: [ADR 003](decisions/003-m11-scroll-narrative.md).

---

# Verificación M0 / M1 — 2026-11-15

Estado vigente: **M1 implementado y `npm run verify` aprobado**. Revisión visual/manual pendiente por limitaciones del entorno. **M0 permanece abierto**, con instalación ahora disponible, pero peer de tooling incompatible detectado por npm y checks manuales aún pendientes.

## Revisión actual — Universo Vivo (M1)

Se inspeccionaron instrucciones, arquitectura, diseño y decisiones antes de editar. No hay repositorio Git válido en la ruta (`git status --short` falla); no se inicializó Git ni se crearon commits/push. Al comenzar esta revisión ya existían `node_modules` y `package-lock.json`; se conservaron y no se modificó package.json ni el lockfile. El bloqueo histórico de ausencia de dependencias ya no describe este workspace.

### Estado real de M0 recibido

- `npm ls --depth=0`: código 0; Astro 7.4.12, React 19.3.1, GSAP 3.15.1, TypeScript 5.9.3, typescript-eslint 8.36.0 y Vitest 4.1.12 instalados. Node 24.22.1.
- `npm run verify` inicial: check (15 archivos, 0 diagnósticos) y lint aprobados; se detuvo en Prettier con cuatro archivos previos sin formato. Se corrigió exclusivamente formato en `demo.astro` además de los archivos afectados por M1 y este informe.
- `npm test` y `npm run build` individuales: aprobados antes de la verificación final; demo y portada generadas.
- `npm ls --all`: código 1, ELSPROBLEMS. typescript-eslint 8.36.0 y sus módulos declaran TypeScript `>=4.8.4 <5.9.0`; la instalación recibida contiene 5.9.3. Es un defecto previo del árbol instalado, no introducido por la landing. No se fuerza npm ni se oculta el peer. Requiere resolver tooling compatible en el cierre de M0; esta tarea no cambió dependencias.

### Resultados integrados de M1

`npm run verify` se ejecutó completo y terminó con código 0:

| Comprobación | Resultado real                              |
| ------------ | ------------------------------------------- |
| Astro check  | 26 archivos; 0 errores, 0 warnings, 0 hints |
| ESLint       | Aprobado                                    |
| Prettier     | Aprobado, todos los archivos coinciden      |
| Vitest       | 2 archivos, 9 pruebas aprobadas             |
| Build        | Aprobado; rutas `/` y `/demo` generadas     |

Las seis pruebas existentes de historias se conservan. Las tres nuevas pruebas unitarias verifican coordinación de pausa por viewport/pestaña, retirada del listener y desconexión del observer, ausencia de tweens al pausar y ausencia de efectos cuando no coincide la consulta de movimiento permitido. Usan dobles de GSAP y navegador: no prueban renders, fluidez, reversión de estilos real ni integración de ScrollTrigger en navegador.

Se detectó y corrigió un acceso posiblemente undefined al registro de IntersectionObserver bajo TypeScript strict. La revisión independiente de código detectó que pausa dejaba reveals activos; se corrigió con retorno temprano antes de crear cualquier tween/trigger y se cubrió en la prueba de pausa.

### Diseño y rendimiento implementados

- Hero editorial, polaroids, dos órbitas estáticas y atmósfera con 54 estrellas distribuidas en tres capas de desplazamiento desfasado; sin parpadeo.
- Dos nebulosas de gradientes radiales estáticos, animadas únicamente mediante transform. Sin filtros animados, Three.js ni smooth scrolling.
- Entrada coordinada, flotación con duraciones diferentes, ScrollTrigger de revelado único, parallax fine/hover y microinteracciones CSS en controles.
- Pausa manual, reduced-motion reactivo, contexto propio y descarte de imports tardíos; pausa ambiental fuera de viewport y al ocultar la pestaña.
- Tres paisajes stock de ejemplo locales, sin fotos personales. Créditos y licencias visibles y en `public/images/credits.json`; texto ilustrativo identificado, sin testimonios ficticios. Descarga de nuevos paisajes falló por DNS, por lo que se usó el catálogo local de la skill con procedencia documentada.
- WebP a 640px: **177320 bytes totales (~173.2 KiB)**. Imagen inferior lazy y reutilizada; dimensiones/aspect ratio reservados. Originales JPEG excluidos.
- Artefactos JS del build, gzip local orientativo: runtime client ~64.3 KiB, GSAP ~26.6 KiB, ScrollTrigger ~17 KiB, feature ~3.1 KiB. No son una medición de transferencia por ruta ni LCP/CLS/FPS reales.
- Paleta y fuentes existentes conservadas; fallback Georgia/system sin red. Collage móvil en flujo para no depender de la altura fija del texto. No se añadieron dependencias.

### Navegador y límites de evidencia

- `npm run dev -- --host 127.0.0.1` y ejecución directa del binario Astro: código 1, proceso sale antes de ready (`Dev server process exited before becoming ready`). No hay servidor de desarrollo validado en este entorno.
- Edge headless: código 133, crashpad `setsockopt: Operation not permitted`; segundo intento sin crash reporter produjo el mismo error.
- Firefox headless: código 139; no generó captura, ni siquiera de about:blank.
- Contexto y detector Impeccable: no ejecutados, no se pudo descargar el motor por red. Se leyeron documentos existentes y craft-floor directamente; revisión independiente limitada a código.
- **No hay revisión visual aprobada**, capturas válidas, medición de FPS/LCP/CLS, prueba de teclado, contraste renderizado ni comprobación responsive en navegador. La inspección del HTML generado confirma contenido SSR presente; no se presenta como prueba de navegador con JS desactivado.

### Cierre manual pendiente

Con un navegador funcional: abrir `/` y `/demo` a 320, 390, 768, 1024 y 1440px; revisar solapes, overflow, imágenes, foco, teclado y zoom 200%. Probar hover y touch; pausar/reanudar repetidamente; reduced motion antes de cargar y cambios en vivo. Desactivar JS y red de fuentes; comprobar lectura y links. Montar/desmontar con import pendiente y repetir diez ciclos: sin listeners/triggers acumulados. Confirmar ambiente pausado al cambiar de pestaña y al salir del hero, y medir rendimiento en móvil real. Resolver el peer previo de tooling sin force/legacy-peer-deps antes de cerrar M0.

Decisiones: [ADR 002](decisions/002-universo-vivo.md), [fundamentos visuales](design-system/foundations.md) y [arquitectura](architecture/overview.md).

---

## Histórico M0 anterior — no describe la instalación actual

El registro siguiente se conserva como historial; sus bloqueos de instalación y gates fueron reevaluados arriba.

## Seguimiento: resolución de ERESOLVE

Proyecto revisado en `~/Documentos/Proyectos/entremomentos`. Se leyeron AGENTS.md, README, arquitectura, decisiones, package.json y configuraciones. Se aplicaron las skills globales `investigate-first`, `surgical-patch` y `verify-and-stop`; no se instalaron skills.

### Causa y corrección

El manifiesto original combinaba ESLint 9.39.5 con eslint-plugin-astro 3.2.1, cuyo peer exige ESLint >=10. Al iniciar esta revisión, package.json ya contenía `^1.3.1`; se conservó esa corrección de rama y se actualizó el mínimo a `^1.7.0`, la versión estable más reciente de la rama 1 en los metadatos disponibles. Esta versión declara ESLint >=8.57.0 y Node ^18.18.0 || ^20.9.0 || >=21.1.0. El rango excluye las ramas 2 y 3.

Se mantiene ESLint `^9.39.5` y @eslint/js `^9.39.5`. Subir a ESLint 10 produciría además incompatibilidades declaradas con eslint-plugin-react-hooks 5.2.0 y eslint-plugin-jsx-a11y 6.10.2, que aceptan ESLint hasta la rama 9. No se necesita cambiar eslint.config.mjs: la rama 1 conserva la configuración `flat/recommended` usada actualmente. Su ejecución real aún está pendiente. No se modificó Story Player ni su arquitectura.

Fuentes primarias: [manifiesto 3.2.1](https://github.com/ota-meshi/eslint-plugin-astro/blob/v3.2.1/package.json), [manifiesto 1.7.0](https://github.com/ota-meshi/eslint-plugin-astro/blob/v1.7.0/package.json), [Astro 7.4.11](https://github.com/withastro/astro/blob/astro%407.4.11/packages/astro/package.json), [integración React 7.1.9](https://github.com/withastro/astro/blob/%40astrojs/react%407.1.9/packages/integrations/react/package.json).

### Auditoría estática aprobada (no equivale a instalación)

Se revisaron los metadatos npm disponibles en caché para las 23 dependencias directas: todos sus requisitos declarados de Node admiten Node 24.22.1. Se comprobaron con semver 15 relaciones de peers cuyos proveedores son dependencias directas: ninguna incompatibilidad en las versiones candidatas siguientes. No se pudo auditar completamente el árbol transitivo porque npm no terminó de resolverlo. La caché no garantiza las últimas publicaciones del registro.

| Grupo           | Versiones candidatas según rangos y metadatos disponibles    | Resultado estático                                    |
| --------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
| ESLint          | eslint / @eslint/js 9.39.5; plugin Astro 1.7.0               | Compatible                                            |
| Plugins de lint | typescript-eslint 8.72.2, react-hooks 5.2.0, jsx-a11y 6.10.2 | Admiten ESLint 9                                      |
| Astro           | 7.4.12; @astrojs/react 7.1.9                                 | Node >=22.23.4; Node actual admitido                  |
| React           | react / react-dom 19.3.1; tipos 19.3.0                       | Peers compatibles                                     |
| Tailwind        | tailwindcss / @tailwindcss/vite 4.3.5                        | Plugin admite Vite 5.2, 6, 7 y 8                      |
| Tipos y pruebas | TypeScript 5.9.3, @astrojs/check 0.9.12, Vitest 4.1.12       | Peers directos compatibles; Vite transitivo pendiente |
| Formato         | Prettier 3.10.1, plugin Astro 1.1.2                          | Peer Prettier ^3.5.3 satisfecho                       |
| Otros           | GSAP 3.15.1, Lucide React 1.73.0, Zod 4.6.7, globals 16.5.0  | Sin conflicto directo detectado                       |

Los peers opcionales de compilador React, renderizadores de pruebas y cobertura no se incorporan sin uso. Las versiones de la tabla son candidatas, no versiones instaladas ni bloqueadas en un lockfile.

### Ejecución en esta revisión

- `npm install`: iniciado normalmente y detenido tras registrar EAI_AGAIN; se repitió como `npm_config_fetch_retries=0 npm_config_fetch_timeout=5000 npm install` para acotar esperas. Solo se ajustaron tiempos de red, sin ignorar peers ni engines. El segundo intento terminó con código 1 y EAI_AGAIN para @astrojs/compiler-binding.
- No se generó package-lock.json ni se eliminó un lockfile existente: no había ninguno al iniciar.
- `npm run format`, `npm run check`, `npm run lint`, `npm test` y `npm run build`: ejecutados, todos con código 127 porque prettier, astro, eslint y vitest no están instalados. No son fallos demostrados del código fuente.
- `npm run verify`: ejecutado, código 127; se detuvo en check. Sus pasos posteriores no se ejecutaron dentro de ese comando.
- Navegador: se detectó Firefox, pero no se puede servir ni construir la aplicación sin dependencias. Portada, /demo, GSAP, ScrollTrigger, limpieza y movimiento reducido: **no ejecutados** en navegador.

### Continuación exacta en terminal local

```bash
cd ~/Documentos/Proyectos/entremomentos
node --version
npm --version
npm install
npm ls --all
npm run format
npm run check
npm run lint
npm test
npm run build
npm run verify
npm run dev
```

Conservar el package-lock.json que genere la instalación. Comprobar que npm ls no informe peers inválidos y que no aparezcan advertencias EBADENGINE; corregir cualquier fallo antes de cerrar M0. Después seguir la lista manual de navegador al final de este documento. No se crean commits ni se hace push.

## Registro anterior (histórico, no reejecutado)

## Resultados reales

- Inspección: Fedora 44, Node 24.22.1, npm 12.2.2. Proyecto nuevo aislado; no se modificaron proyectos existentes ni se creó un repositorio Git.
- Consulta npm en línea: falló con EAI_AGAIN al resolver registry.npmjs.org. El entorno declara CODEX_SANDBOX_NETWORK_DISABLED=1.
- Instalación `npm install --offline --ignore-scripts --no-audit --no-fund --fetch-retries=0`: falló con ENOTCACHED para @astrojs/check. Tampoco hay Astro ni GSAP en caché. No hay instalación resuelta ni package-lock.json.
- Prueba auxiliar real: 7 assertions Node aprobadas sobre el schema y fixture originales copiados temporalmente, usando Zod 4.6.6 extraído de caché. Casos: muestra válida, tres fechas inválidas, identificadores duplicados, historia vacía y tema desconocido. No equivale a ejecutar Vitest.
- Prettier 3.9.10 de caché formateó archivos no Astro. El plugin Astro no está disponible; el formato global sigue pendiente.
- `npm run check`: falló, astro no instalado.
- `npm run lint`: falló, eslint no instalado.
- `npm run format:check`: falló, prettier no instalado en el proyecto.
- `npm test`: falló, vitest no instalado.
- `npm run build`: falló, astro no instalado.
- No se ejecutó revisión visual, medición de rendimiento ni prueba de ScrollTrigger en navegador. No se detectó ejecutable Chromium/Chrome en las rutas consultadas.

## Cierre pendiente con acceso a npm

1. Ejecutar `npm install`; resolver cualquier incompatibilidad real de peers o engines sin forzar la instalación. Conservar el lockfile generado.
2. Ejecutar `npm run format` y `npm run verify`; corregir errores antes de declarar M0 terminado.
3. Abrir portada y `/demo` a 320, 390, 768, 1024 y 1440px. Revisar overflow, controles, foco, contraste y zoom al 200%.
4. En `/demo`, comprobar entrada y desplazamiento de la luz al hacer scroll. Montar/desmontar diez veces; confirmar que los ScrollTriggers y listeners propios desaparecen y no se acumulan. Repetir con React StrictMode en un harness temporal si se investiga doble montaje.
5. Activar movimiento reducido antes de cargar: todo legible y sin animaciones ni triggers. Cambiar la preferencia con la demo montada: estilos animados revertidos. Cambiarla rápidamente y desmontar antes de resolver la carga: ningún contexto tardío.
6. Desactivar JS: recuerdo y portada legibles. Verificar fallback de fuentes sin red. Recargar, navegar ida/vuelta y observar consola.
7. Medir rendimiento móvil antes de incorporar más efectos; no hay presupuesto aprobado mediante mediciones en M0.

Este informe distingue implementación, prueba auxiliar y validación integrada. M0 no se considera cerrado mientras los gates y la revisión manual estén pendientes.
