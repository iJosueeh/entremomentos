# QA del despliegue unificado — 2026-11-15

**Registro histórico del cambio anterior. La configuración vigente usa `npm run build` y `dist/`, sin perfiles; véanse [ADR 014](../decisions/014-standard-build.md) y [verificación actual](../verification.md).**

Preparación local completada; aceptación visual pendiente. Decisión vigente: [ADR 013](../decisions/013-unified-deployment.md). No se desplegó, creó otro proyecto, hizo commit ni push.

## Evidencia ejecutada

- `npm run verify`: código 0. Log local `/tmp/entremomentos-unified-verify.log`. Astro check: 83 archivos, cero errores, warnings o hints; ESLint y Prettier aprobados; Vitest: 16 archivos y 165 pruebas aprobadas; tres builds y gates aprobados.
- `dist/unified`: 27 archivos, exactamente `index.html`, `demo/index.html` y `para/danna/index.html` como páginas. Incluye las seis escenas SSR de cada historia, hidratación, recursos de demo y favicon. No incluye el laboratorio ni sitemap.
- Gates: no hay referencias locales faltantes detectadas en atributos HTML, URLs CSS e imports estáticos/literales de JS. Todos los chunks emitidos son alcanzables. No comprueba disponibilidad de fuentes externas ni solicitudes dinámicas arbitrarias en runtime.
- Danna: título/firma y seis escenas en orden, isla de hidratación, `noindex, nofollow`, sin imágenes. Landing/Demo: sin marcadores personales en su HTML, incluidos metadatos. La ruta es pública sin control de acceso.
- `public`: dos páginas, 26 archivos, conserva exclusión completa de Danna. `personal`: una página, 10 archivos, conserva exclusión de Landing/Demo y medios demostrativos.
- Pruebas añadidas: unified exige las tres rutas; rechaza referencias personales en Landing, recursos faltantes y ausencia de noindex. Se conservan las pruebas negativas de aislamiento anteriores.
- `git diff --exit-code -- src/features/story-player/animations src/features/story-player/hooks src/features/story-player/components src/features/story-player/schemas src/features/story-player/data src/features/landing src/routes package-lock.json`: código 0. Renderer, contrato, navegación, animaciones, demo y dependencias sin cambios. En `danna-story.ts` solo se actualizó un comentario obsoleto; la narrativa aprobada no cambia.

La suite incluye SSR, anclas, carta, navegación, limpieza de recursos y timelines GSAP reales sobre objetos/dobles DOM. Esto respalda ausencia de regresiones en las comprobaciones automatizadas; no certifica render o fluidez en navegador.

## Navegador y HTTP: bloqueados

- `timeout 15s firefox --headless --screenshot /tmp/entremomentos-unified-browser.png about:blank`: Firefox terminó con segmentation fault antes de renderizar incluso una página vacía. Log `/tmp/entremomentos-unified-browser.log`; no hay captura válida.
- `npm run preview -- --host 127.0.0.1`: código 1, `Preview server process exited before becoming ready.` Log `/tmp/entremomentos-unified-preview.log`. No se pudo probar HTTP ni ejecutar interacciones sobre el artefacto.

**No se aprueba QA visual**, responsive de la carta, navegación/scroll real, hidratación ni GSAP en navegador. No se cambian restricciones del entorno ni se solicitan privilegios.

## Verificación pendiente en un entorno con navegador

Ejecutar `npm run preview -- --host 127.0.0.1` y abrir las tres rutas. Seguir la [matriz RC1](rc1.md) en 320×568, 375×667, 390×844, 430×932, 768×1024, 1024×768 y 1440×900. Para esta versión unificada, sustituir las expectativas históricas de 404 de Danna por acceso correcto en preview; el 404 sigue correspondiendo al perfil separado public.

Comprobar carta completa hasta firma, scroll interno con cierre accesible, Tab/Enter/Escape, foco y scroll restaurados al cerrar, anclas y navegación entre rutas, scroll normal/inverso, pausa/reanudación, reduced motion, resize/orientación, sin JS, ausencia de errores de hidratación/consola y 404 en Network. Probar galería y visor en Demo. Registrar capturas y ciclos reales; no usar estos pasos pendientes como evidencia aprobada.

La configuración del dashboard Vercel no se inspeccionó ni modificó. [Guía operativa](../deployment-profiles.md): un único proyecto existente, comando unified, salida unified y Node 24 compatible.
