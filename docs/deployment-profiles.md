# Despliegue estándar — EntreMomentos

Decisión vigente: [ADR 014](decisions/014-standard-build.md). Un único proyecto Astro y el proyecto Vercel existente **https://entremomentos.vercel.app**. Preparación local; sin despliegue ni cambios del dashboard.

## Build y rutas

```bash
npm ci
npm run verify
npm run preview -- --host 127.0.0.1
```

`npm run build` ejecuta Astro y los gates sobre su salida estándar `dist/`. Genera `/`, `/demo/` y `/para/danna/` en el mismo artefacto. `npm run preview` sirve ese directorio. No hay selección de perfiles ni directorios de salida alternativos. `BUILD_PROFILE` ya no se lee; eliminar esa variable de la configuración anterior. Astro limpia la salida al compilar: los antiguos subdirectorios no deben quedar dentro de `dist/`.

Las rutas reutilizan Story V2, Story Player y sus documentos existentes. `/dev/gsap` se registra solo durante desarrollo. No se duplican historias, componentes ni animaciones.

## Configuración del proyecto Vercel existente

| Ajuste               | Valor                                                                         |
| -------------------- | ----------------------------------------------------------------------------- |
| Framework Preset     | Astro                                                                         |
| Root Directory       | Directorio con este `package.json`; `.` si es raíz del repositorio            |
| Install Command      | `npm ci`                                                                      |
| Build Command        | `npm run build`                                                               |
| Output Directory     | `dist` (valor estándar de Astro; retirar el override anterior o poner `dist`) |
| Node.js Version      | 24.x, compatible con `>=24.22.1 <25` de engines                               |
| Variables necesarias | Ninguna; eliminar `BUILD_PROFILE` de Production, Preview y Development        |
| Dominio              | Conservar `entremomentos.vercel.app`                                          |

No se requiere adaptador, SSR, función ni secretos para este sitio estático. Referencias: [Astro estático en Vercel](https://vercel.com/docs/frameworks/frontend/astro#static-rendering) y [versiones de Node](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions). La versión menor/parche debe satisfacer engines; comprobarla en el log del build.

No crear otro proyecto. El dashboard no se inspeccionó ni modificó; estos ajustes quedan documentados para su aplicación posterior. No se despliega automáticamente ni se ejecutan commits o push.

## Acceso e indexación

**`/para/danna/` es pública y no tiene control de acceso.** Cualquiera que reciba o conozca el enlace puede leer y copiar HTML, props y recursos. Esta exposición está aceptada expresamente para v1.

La dedicatoria conserva `noindex, nofollow` como indicación de indexación, no como seguridad. No hay sitemap; si se incorpora uno, excluir esa ruta. Landing y Demo no mencionan a Danna en sus metadatos ni enlazan su historia. Se conserva el contenido aprobado, con `memories: []`, sin fotografías personales ni datos adicionales.

## Verificación

`npm run verify` ejecuta tipos, lint, formato, Vitest y un único `npm run build`. Los gates exigen las tres rutas exactas, recursos previstos, referencias locales existentes, chunks alcanzables, seis escenas SSR, hidratación y noindex de Danna. Rechazan laboratorio, fotografías en Danna, referencias personales en Landing/Demo y restos de salidas antiguas. El gate narrativo conserva sus comprobaciones de Demo, anclas y Landing.

Las pruebas automatizadas no sustituyen el navegador. La revisión visual, responsive, navegación/scroll, carta y GSAP en navegador conservan sus pendientes; véase [verificación](verification.md). La matriz [RC1](qa/rc1.md) es histórica: ahora debe probar las tres rutas sobre el mismo preview de `dist/`, con Danna accesible, sin esperar el antiguo 404.
