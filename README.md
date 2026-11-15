# EntreMomentos

Plataforma pública en construcción para crear historias emocionales interactivas y compartirlas con un enlace, sin programar. Combina un universo celestial, recuerdos y narrativa mediante scroll e interacciones manuales.

## Estado: M2.3 — Los recuerdos que permanecen

La landing M1.1 conserva sus cuatro actos. `/demo` utiliza el Story Player: seis escenas semánticas, contrato Zod V2 e historia ficticia de amistad de Alma y Nico. M2.1 implementa «Un universo que recuerda»: cielo con profundidad, luz y revelado editorial en Intro; dos luces y una constelación reversible con scroll en Connection. Todo el contenido se prerenderiza en HTML. Las anclas funcionan sin JavaScript; pausa y movimiento reducido restauran una composición estática completa y mantienen estados independientes. M2.2 añade una galería editorial con fotografías progresivas y ampliación opcional que restaura foco y punto de lectura. Admite 0–100 recuerdos con imágenes opcionales (las dedicatorias pueden no tener recuerdos); sin JavaScript las fotos mantienen enlaces nativos. M2.3 añade Discovery con un hilo desplegable opcional hacia los recuerdos, una carta Ivory que sale de su sobre y regresa mediante una timeline reversible, y una constelación final con regreso al inicio. La carta conserva una sola copia del mensaje y la firma V2, funciona con teclado/Escape y movimiento reducido, y es independiente de la pausa decorativa; sin JavaScript el papel permanece abierto y legible. Su superficie de lectura modal separa cierre y cuerpo desplazable, restaura foco/scroll al terminar el regreso al sobre y evita contextos transformados mediante el top layer; véase [ADR 011](docs/decisions/011-letter-reading-surface.md).

M2.2.1 añade atmósferas específicas por escena y continuidad fotográfica de elemento compartido con GSAP: apertura/cierre de 560 ms, recorte y proporción conservados, interrupciones y reducción de movimiento. Se conserva la M2.3 ya presente en esta copia. La aceptación visual sigue pendiente; véase [ADR 008](docs/decisions/008-visual-depth-photo-motion.md).

La demo técnica M0 se conserva en `/dev/gsap`, registrada exclusivamente por `astro dev`; ni la ruta ni sus chunks y estilos se incluyen en producción. No hay editor, autenticación, base de datos ni publicación real. La aceptación visual y de interacción real de M2.1/M2.2/M2.3 sigue pendiente porque los navegadores y el servidor de desarrollo no arrancan en este entorno; se conservan los pendientes previos de M1.1/M2.0.

Hay dependencias instaladas y `package-lock.json`. Los resultados actuales y las comprobaciones manuales pendientes están en [verificación](docs/verification.md). M0 sigue abierto por la revisión de navegador. El peer de TypeScript se resolvió con typescript-eslint 8.72.2; ESLint 9 está fuera de soporte y la auditoría de vulnerabilidades sigue pendiente por fallo de red.

## Stack y requisitos

Astro 7, React 19, TypeScript strict, Tailwind CSS 4 con plugin Vite, GSAP 3 + ScrollTrigger, Lucide React y Zod 4. ESLint flat config, Prettier con plugin Astro, Astro check y Vitest.

Node.js 24 LTS (24.22.1 o superior dentro de la rama 24), npm; entorno inspeccionado: Fedora 44, Node 24.22.1, npm 12.2.2. El árbol instalado permite ejecutar las comprobaciones; npm ls --all no detecta peers inválidos tras la normalización del tooling.

## Instalación y ejecución

```bash
cd ~/Documentos/Proyectos/entremomentos
npm install
npm run dev
```

Abrir `http://localhost:4321`, `/demo` y, solo durante desarrollo, `/dev/gsap`. La dedicatoria local está en `/para/danna/`: ejecutar `npm run dev -- --host 127.0.0.1`. Esa ruta y su documento se excluyen del build público; no se publica el servidor de desarrollo. Ver [verificación de privacidad y QA](docs/qa/danna-v1.md). Conservar el `package-lock.json` existente y usar `npm ci` para reproducirlo. La instalación limpia y los peers están verificados; conservar los pendientes de navegador y mantenimiento registrados en verification. No usar `--force` ni `--legacy-peer-deps` para ocultar incompatibilidades.

| Comando                | Función                                                                 |
| ---------------------- | ----------------------------------------------------------------------- |
| `npm run dev`          | Desarrollo Astro                                                        |
| `npm run build`        | Generación estática pública en dist/public                              |
| `npm run preview`      | Previsualización del build                                              |
| `npm run check`        | Tipos y diagnósticos Astro                                              |
| `npm run lint`         | ESLint en JS, TS, TSX y Astro                                           |
| `npm run format`       | Formatear archivos                                                      |
| `npm run format:check` | Verificar formato                                                       |
| `npm test`             | Contratos, SSR y ciclo de vida con Vitest                               |
| `npm run verify`       | Tipos, lint, formato, pruebas, build y comprobación del HTML/artefactos |

## Perfiles de despliegue

`npm run build` / `npm run build:public` generan solo `/` y `/demo` en `dist/public`. `npm run build:personal` genera solo `/para/danna/` en `dist/personal`, reutilizando el documento y Story Player existentes. `npm run verify` comprueba ambos artefactos. No subir la historia sin validar antes la protección sobre contenido inocuo. Configuración exacta de Vercel, límites actuales por plan y alternativa Cloudflare Access: [guía de despliegue seguro](docs/deployment-profiles.md) y [ADR 012](docs/decisions/012-build-profiles.md).

## Organización

```text
src/routes/                        Entradas Astro seleccionadas por perfil
src/components/layout/             Documento y navegación comunes
src/features/landing/              Universo Vivo: presentación, datos, hooks, animaciones y CSS
src/features/story-player/
  components/                      StoryPlayer, navegación, fotos y seis escenas
  hooks/                           Ciclo de vida del navegador
  animations/                      GSAP y parámetros de movimiento
  schemas/                         Validación y tipos inferidos
  data/                            Historia local de muestra
  styles/                          Presentación propia del player
  dev/                             Laboratorio M0, contrato V1 y estilos exclusivos de desarrollo
  index.ts                         API pública del renderer
  document.ts                      API pública de validación y muestra; entrada separada del bundle cliente
src/styles/                        Tokens y estilos comunes
public/                            Favicon; fotografías de ejemplo WebP y créditos
tests/                             Contratos V1/V2, medios, SSR, movimiento y navegación
scripts/check-story-build.mjs       Comprueba HTML, anclas y exclusión del laboratorio tras el build
docs/                             Arquitectura, diseño y decisiones
```

No se crean directorios vacíos. Los tipos se infieren del schema; no existe un directorio `types` redundante. La API del renderer es `index.ts`; `document.ts` expone el contrato y la fixture sin introducirlos en su bundle cliente. El laboratorio tiene su entrada independiente en `dev/index.ts`.

## Roadmap

- M0: fundamentos y demo técnica implementados; gates aprobados en esta revisión, peer de tooling resuelto; cierre pendiente de comprobaciones manuales.
- M1: landing Universo Vivo implementada; verificación visual pendiente.
- M2.0: contrato V2, muestra ficticia, seis escenas básicas, navegación y mejora GSAP mínima; pruebas integradas y aceptación visual registrada por separado.
- M2.1: Intro y Connection cinematográficas implementadas; validación visual y de interacción real pendiente.
- M2.2: galería editorial progresiva y ampliación opcional implementadas; verificación visual y de interacción real pendiente.
- M2.3: Discovery, Letter y Epilogue implementadas; pruebas integradas y aceptación visual/teclado real pendiente. Las interacciones no bloquean el avance.
- M2.4: integración, accesibilidad, responsive y rendimiento en navegador/móvil.
- Posterior: editor sin código y persistencia para compartir por enlace, con decisiones independientes sobre almacenamiento y servicios.

M0 no incorpora backend, autenticación, pagos, CMS, estado global, smooth scrolling ni servicios externos de datos. Las fuentes se solicitan a Google Fonts; sin red se utilizan Georgia y fuentes del sistema.

Consulta [arquitectura](docs/architecture/overview.md), [Story Player — ADR 004](docs/decisions/004-story-player.md), [apertura cinematográfica — ADR 005](docs/decisions/005-cinematic-opening.md), [galería de recuerdos — ADR 006](docs/decisions/006-living-memories.md), [carta reversible — ADR 007](docs/decisions/007-lasting-memories.md), [sistema visual](docs/design-system/foundations.md) y [reglas para agentes](AGENTS.md).
