# Un solo proyecto Vercel — EntreMomentos

Decisión vigente: 2026-11-15, [ADR 013](decisions/013-unified-deployment.md). Preparación local, sin despliegue ni cambios en el dashboard. Sustituye la recomendación anterior de dos proyectos de ADR 012.

## Artefactos y rutas

| Perfil                     | Comando                                   | Output Directory | Rutas                         |
| -------------------------- | ----------------------------------------- | ---------------- | ----------------------------- |
| Unificado (predeterminado) | `npm run build:unified` o `npm run build` | `dist/unified`   | `/`, `/demo/`, `/para/danna/` |
| Público separado           | `npm run build:public`                    | `dist/public`    | `/`, `/demo/`                 |
| Personal separado          | `npm run build:personal`                  | `dist/personal`  | `/para/danna/`                |

Un único build unificado reutiliza las entradas existentes, Story V2 y Story Player; no duplica historias ni componentes. El laboratorio `/dev/gsap` sigue limitado a desarrollo. Public y unified copian los recursos demostrativos actuales de `public/`; personal copia únicamente el favicon mediante allowlist. No subir `dist` completo: puede contener artefactos de otros perfiles.

`BUILD_PROFILE` admite `unified`, `public` o `personal`. Ausente significa `unified` en Astro. Los scripts fijan explícitamente el perfil y abortan si una variable existente contradice el comando. `npm run verify` necesita esa variable sin definir para compilar y comprobar los tres perfiles.

## Configuración del proyecto existente

Usar únicamente el proyecto que sirve **https://entremomentos.vercel.app**. No crear un proyecto adicional.

| Ajuste                                               | Valor                                                                   |
| ---------------------------------------------------- | ----------------------------------------------------------------------- |
| Framework Preset                                     | Astro                                                                   |
| Root Directory                                       | Directorio con este `package.json`; `.` si es raíz del repositorio      |
| Install Command                                      | `npm ci`                                                                |
| Build Command (override)                             | `npm run build:unified`                                                 |
| Output Directory (override)                          | `dist/unified`                                                          |
| Node.js Version                                      | 24.x, compatible con `>=24.22.1 <25` de engines                         |
| Variables necesarias                                 | Ninguna; el comando ya establece el perfil                              |
| `BUILD_PROFILE` si se conserva una variable anterior | Eliminarla o cambiarla a `unified` en Production, Preview y Development |
| Dominio                                              | Conservar `entremomentos.vercel.app`                                    |

Vercel admite [Astro estático](https://vercel.com/docs/frameworks/frontend/astro#static-rendering) sin adaptador. Seleccionar explícitamente [Node 24.x](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) y confirmar en el log que cumple engines: Vercel administra las versiones menores/parches. No se requiere SSR, función, token, secreto ni variable `PUBLIC_*`. No se añadió configuración remota ni `vercel.json`; los overrides deben coincidir con esta tabla antes de un despliegue manual posterior.

La producción debe permitir acceso público para compartir esta versión sin login. No se inspeccionó el estado actual de Deployment Protection del proyecto; esta tarea no cambia sus ajustes ni publica automáticamente. No se hacen commits ni push.

## Acceso e indexación

**`/para/danna/` es pública y no tiene control de acceso.** Cualquiera que conozca o reciba el enlace puede leer y copiar la historia, sus props y los archivos del despliegue. Esta exposición es una decisión explícita del usuario para v1. No se afirma que el contenido esté protegido.

La dedicatoria emite `noindex, nofollow`: es una indicación de indexación para buscadores, no una medida de seguridad. No hay sitemap ni integración de sitemap; Danna no se incluye en ninguno. Si se introduce uno, excluir explícitamente esta ruta. Landing y Demo conservan sus metadatos y HTML sin referencias a Danna. No se añade un enlace a la dedicatoria desde esas páginas.

Se conserva exactamente el contenido aprobado, con `memories: []`, sin fotos personales ni datos privados adicionales. Los recursos fotográficos de demo permanecen como muestra ficticia.

Los perfiles separados se conservan para posibles publicaciones futuras. `personal` también es un artefacto estático sin autenticación: una publicación futura que requiera privacidad necesitará control de acceso efectivo del hosting para HTML y recursos, antes de subir contenido. Cambiar de perfil o añadir noindex no proporciona esa protección. Los procedimientos anteriores de dos proyectos quedan como decisión histórica en ADR 012, fuera de esta versión.

## QA y preview local

```bash
npm run verify
npm run preview -- --host 127.0.0.1
# Abrir /, /demo/ y /para/danna/ en el puerto indicado por Astro.
```

`npm run preview:public` y `npm run preview:personal` sirven las salidas separadas en loopback. `npm run dev` conserva las tres vistas y el laboratorio; no es hosting.

Los gates exigen rutas exactas, recursos allowlisted, referencias locales existentes y chunks alcanzables; rechazan laboratorio, fotos en Danna y referencias personales en Landing/Demo. Conservan el aislamiento completo del perfil público y personal. El gate narrativo se ejecuta también sobre unified: seis escenas SSR de demo, anclas, landing, cierre y exclusión del laboratorio. Vitest cubre contratos, SSR, navegación, carta, ciclo de vida y GSAP; no sustituye un navegador.

Resultados y bloqueos actuales: [QA unificado](qa/unified-deployment.md). La matriz visual RC1 sigue pendiente. En el preview unificado se debe exigir acceso a Danna, en lugar del 404 que exigía el perfil público histórico.
