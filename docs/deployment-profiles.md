# Despliegues independientes: público y personal

Preparación local: 2026-11-15. No se desplegó ni se verificó la protección de una cuenta real. **NO-GO para subir contenido personal hasta completar la prueba de protección con contenido inocuo.** La matriz visual RC1 sigue pendiente.

## Causa del 404 y perfiles

Antes, `astro.config.mjs` inyectaba `/para/danna/` únicamente con `command === 'dev'`. `astro build` solo producía `/` y `/demo`; Vercel no podía servir un HTML inexistente. El slash final no era la causa. No se inspeccionó la configuración remota ni se pudo obtener la URL con la herramienta web; el diagnóstico corresponde al código y al build local.

Las dos páginas públicas pasan de `src/pages` a `src/routes` sin cambiar su contenido. La configuración inyecta exclusivamente las entradas del perfil. El documento personal permanece en `features/story-player/local`, sin exportarse en la API pública. Story Player, Story V2, narrativa, CSS y animaciones se conservan. La cabecera personal enlaza al sitio público existente mediante una propiedad opcional del layout, conservando su presentación.

| Perfil                   | Comando                                  | Salida que se puede subir | Rutas HTML     | Archivos estáticos copiados             |
| ------------------------ | ---------------------------------------- | ------------------------- | -------------- | --------------------------------------- |
| Público (predeterminado) | `npm run build:public` o `npm run build` | `dist/public`             | `/`, `/demo`   | favicon, cuatro WebP de demo y créditos |
| Personal                 | `npm run build:personal`                 | `dist/personal`           | `/para/danna/` | Solo favicon                            |

Astro emite los JS/CSS necesarios para cada grafo de imports. No hay redirección desde `/` personal ni demo personal. `public-personal` es una ruta de entrada deliberadamente inexistente: no se copia `public/` al build personal; el hook copia únicamente el favicon. Si se necesitan nuevas fotos personales, ubicarlas fuera de `public/`, declarar su inclusión y actualizar el gate antes de incorporarlas. No subir nunca `dist` completo: contiene ambos perfiles y puede conservar artefactos históricos de builds anteriores. Subir exclusivamente la subcarpeta indicada.

## Variables y comandos locales

Node requerido por el proyecto: `>=24.22.1 <25`, npm y `npm ci`. No se añadieron dependencias.

- `BUILD_PROFILE`: valor exacto `public` o `personal`; solo se lee en Node al configurar Astro. Ausente significa público. Los comandos de build fijan el perfil y abortan si la variable existente contradice el comando. Un valor desconocido también aborta. No es autenticación ni un secreto.
- No se necesita ninguna contraseña, API key ni token en el código o variables `PUBLIC_*`. Las credenciales se administran en el proveedor. No definir `VERCEL_AUTOMATION_BYPASS_SECRET` para este sitio ni incrustar enlaces de bypass en HTML, JS, documentación o analytics.
- `npm run verify` ejecuta tipos, lint, formato, Vitest y ambos builds con sus gates. Para ejecutarlo localmente, dejar `BUILD_PROFILE` sin definir, pues verifica ambos perfiles.
- `npm run preview` sirve `dist/public`. `npm run preview:personal` sirve `dist/personal` en loopback. Son servidores locales **sin autenticación**; no exponerlos a Internet.
- `npm run dev` conserva la vista local de Danna y laboratorio; no utilizar el servidor de desarrollo como hosting.

## Vercel: capacidad actual y límites del plan

Consultado el 2026-11-15 en documentación oficial. El [anuncio de septiembre de 2026](https://vercel.com/changelog/protect-production-deployments-for-free-on-every-plan) reemplaza la limitación anterior de producción para planes gratuitos. No basar la decisión en artículos antiguos sobre el add-on de 150 USD.

| Método                                    | Hobby         | Pro                                                  | Enterprise              |
| ----------------------------------------- | ------------- | ---------------------------------------------------- | ----------------------- |
| Vercel Authentication con All Deployments | Disponible    | Disponible                                           | Disponible              |
| Contraseña de despliegue                  | No disponible | 20 USD/mes por proyecto protegido, adicional al plan | Incluida a nivel equipo |

Según [Deployment Protection](https://vercel.com/docs/deployment-protection), **All Deployments** incluye dominios de producción y URLs de preview; Standard Protection deja dominios de producción accesibles. La protección se aplica a todas las solicitudes: incluye HTML, JS, CSS, imágenes, favicon y JSON del despliegue. No basta proteger el HTML, ocultar la URL, `noindex`, `robots.txt` o un formulario cliente: la historia está en HTML y en las props de hidratación.

[Vercel Authentication](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication) requiere cuenta Vercel con acceso concedido; Hobby permite un usuario externo por cuenta. Ese cupo debe estar disponible para Danna. Los miembros autorizados del equipo también pueden acceder: no es una ACL exclusiva para la destinataria. Si eso no satisface la privacidad esperada, usar un proyecto/equipo apropiado o Access. Una contraseña compartida tampoco identifica individualmente al visitante. [Precios y límites de contraseña](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/password-protection): equipos Pro antiguos pueden conservar el paquete legado de 150 USD/equipo; confirmar la facturación mostrada antes de activarlo.

Los bypass por shareable links, automation, trusted sources y excepciones pueden permitir acceso sin el login esperado. Revisarlos y revocarlos para el proyecto personal. Desactivar la protección deja expuestos también los despliegues existentes; mantenerla activa y retirar despliegues antes de cancelar el proyecto. La autorización no impide que una persona autorizada copie lo que ve.

## Configuración exacta de los dos proyectos

Usar un repositorio privado si incluye el documento narrativo: proteger el hosting no protege un repositorio público, sus logs ni sus artefactos CI. El mismo repositorio puede alimentar dos proyectos Vercel separados; limitar colaboradores y no imprimir la narrativa en logs. No añadir rewrites de Danna al proyecto público.

| Ajuste                                               | Público                                                                      | Personal (configuración final)                                     |
| ---------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Project Name sugerido                                | `entremomentos` (existente)                                                  | `entremomentos-personal`                                           |
| Framework Preset                                     | Astro                                                                        | Astro                                                              |
| Root Directory                                       | Directorio que contiene este `package.json` (`.` si es raíz del repositorio) | El mismo                                                           |
| Node.js Version                                      | 24.x; confirmar que cumple engines en el log                                 | Igual                                                              |
| Install Command                                      | `npm ci`                                                                     | `npm ci`                                                           |
| Build Command (override)                             | `npm run build:public`                                                       | `npm run build:personal`                                           |
| Output Directory (override)                          | `dist/public`                                                                | `dist/personal`                                                    |
| `BUILD_PROFILE` en Production, Preview y Development | `public`                                                                     | `personal`                                                         |
| Deployment Protection                                | Producción pública según necesidades del sitio                               | Vercel Authentication activado, **All Deployments**, Save          |
| Dominio                                              | `entremomentos.vercel.app`                                                   | Dominio independiente asignado al nuevo proyecto; nunca el público |

No se añadió `vercel.json`: una configuración global de output/build podría cruzar los dos proyectos. No usar SSR, adaptadores, funciones ni autenticación cliente para este sitio estático.

### Orden seguro antes del primer contenido personal

1. Crear el proyecto personal **sin conectar despliegue automático de la historia**. Si la interfaz obliga a un primer deploy, usar una copia temporal inocua (página de prueba y archivos CSS/JS/imagen/JSON de prueba), sin el documento narrativo. Otra opción es un primer build con la configuración pública de la tabla, incluidas variable y salida públicas. Configurar Git para omitir builds (Ignored Build Step: `exit 0`) mientras se prepara y se prueba. No activar el build personal aún.
2. En el proyecto personal, abrir Settings > Deployment Protection (según interfaz, Security > Deployment Protection), activar Vercel Authentication, seleccionar **All Deployments**, guardar. Comprobar todos los entornos, ausencia de excepciones, shareable links, automation bypass, trusted sources y allowlists innecesarias. No basta la protección predeterminada de previews. Si falta el selector o no se puede confirmar su alcance, detenerse y aplicar la alternativa inferior.
3. Con el despliegue inocuo, probar **producción y una preview**, con sus dominios generados de deployment, alias de rama, dominio `*.vercel.app` del proyecto y cada dominio personalizado. Incluir deployments antiguos existentes. Enumerar estas URLs desde el dashboard; no asumir que un alias representa todos los demás.
4. En navegador privado sin cookies, comprobar `/`, una ruta HTML y las URLs directas existentes de CSS, JS, imagen y JSON inocuos. Con `curl -sS -D - -o /tmp/access-probe-body 'https://HOST/archivo-existente'` sin `-L`, sin cookies, Authorization ni parámetros de bypass, exigir redirección al login de Vercel o denegación (401/403), **sin el cuerpo original**. Un 404 no demuestra protección; un 200 que entrega el recurso falla. Guardar fecha, hostname, path, status y Location sin tokens como evidencia privada. Probar GET, no solo HEAD. No usar `curl -L` como única evidencia: acabar en 200 en la página de login no equivale a acceder al recurso.
5. Entrar con cuenta autorizada y confirmar acceso a página y recursos. Probar otra cuenta sin permiso y confirmar denegación/solicitud de acceso. Conceder solo el acceso previsto a Danna, sujeto al cupo Hobby, y comprobarlo con su cuenta. Probar cookies por hostname: no asumir que el login en un alias cubre los demás.
6. **Solo si todos los probes pasan**, cambiar el proyecto personal a los valores finales de la tabla, mantener la protección activa y revisar que build/output/variable coinciden en Production y Preview. Eliminar cualquier artefacto/caché de configuración previa al primer build personal (Redeploy sin build cache cuando corresponda). Habilitar Git únicamente tras esta revisión. El despliegue posterior es manual y queda fuera de esta tarea.
7. Tras ese despliegue autorizado, repetir las pruebas anónimas y autorizadas sobre `/para/danna/`, su variante sin slash, los JS/CSS reales de `/_astro/` y `/favicon.svg`, en todos los hosts. Revisar que `/` y `/demo` personales no sirven landing/demo una vez autenticado. Si un recurso personal se entrega anónimamente, retirar el despliegue y corregir la protección antes de compartir. Una prueba posterior no sustituye la prueba inocua previa.

El cambio no certifica los ajustes del dashboard: no hay credenciales ni acceso a esa cuenta en esta revisión. Registrar la evidencia antes de dar GO. La URL pública original `/para/danna` debe seguir devolviendo 404 después de publicar el perfil público; el enlace para Danna pertenecerá al proyecto personal.

## Alternativa: Cloudflare Pages + Access

Si no se dispone de All Deployments efectivo, del cupo de usuarios o del método de acceso deseado, crear un proyecto Pages independiente y servir `dist/personal` detrás de Access. **Poner Cloudflare solo delante del dominio personalizado de Vercel no basta**: los dominios `vercel.app` podrían eludir Access.

Usar inicialmente contenido inocuo y pausar despliegues automáticos. Para Astro estático: build `npm run build:personal`, output `dist/personal`, `BUILD_PROFILE=personal` en producción y preview, Node compatible con engines. Antes de subir la historia, seguir el procedimiento oficial de [Access para Pages](https://developers.cloudflare.com/pages/platform/known-issues/#enable-access-on-your-pagesdev-domain):

1. Workers & Pages > proyecto > Settings > Enable access policy; Manage en la aplicación de preview creada.
2. En Access > Applications > aplicación > Configure, quitar `*` del subdominio para proteger `<proyecto>.pages.dev`, guardar (puede requerir renombrar la aplicación).
3. Volver a Settings > General y activar de nuevo Enable access policy para recuperar la protección de previews. Confirmar **dos** aplicaciones: `<proyecto>.pages.dev` y `*.<proyecto>.pages.dev` (hashes y alias de rama).
4. Para cada dominio personalizado, crear además una aplicación Self-hosted que cubra el hostname completo, sin limitar el path a `/para/`. Cubrir todo el host protege también `/_astro/*` y cualquier archivo estático.
5. En cada aplicación, permitir únicamente los correos exactos autorizados mediante el proveedor de identidad/OTP configurado; no usar Everyone, Bypass ni Allow público. Verificar duración de sesión y acceso con cuenta no autorizada. Confirmar disponibilidad y límites del plan de Zero Trust en la cuenta, sin asumir que el plan de Pages incluye cualquier capacidad de Access.
6. Repetir la matriz anónima/autorizada de HTML y archivos existentes sobre producción, previews y dominios personalizados con el sitio inocuo. Solo después subir el artefacto personal. No basta Enable access policy de previews por sí solo: el dominio principal y los personalizados requieren cobertura explícita.

## Gates locales

`check-profile-build.mjs` exige rutas HTML y recursos estáticos exactos, rechaza archivos desconocidos y source maps, busca marcadores cruzados en **todos** los archivos (incluidas props de islas) y rechaza chunks sin referencia transitiva desde las páginas. El gate personal exige título, firma, seis escenas SSR e isla de hidratación. El gate público anterior conserva sus comprobaciones de anclas y composición. Las pruebas de Vitest incluyen contaminación personal dentro de un chunk público, ausencia de la ruta personal, ruta pública infiltrada y medios/chunks sobrantes. Estos gates acreditan el contenido local, no la autenticación del proveedor ni el QA visual.
