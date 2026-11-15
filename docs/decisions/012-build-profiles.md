# ADR 012 — Builds público y personal aislados

Estado: implementado localmente; publicación personal bloqueada hasta verificar acceso en hosting. Actualiza la restricción de solo desarrollo de ADR 010; no cambia Story V2.

El 404 resulta de registrar Danna solo durante `astro dev`. Habilitarla en el build único expondría la historia en el sitio público. Se eligen dos proyectos de hosting y dos grafos de entrada estáticos; no se añade un modo al renderer ni se duplican componentes o narrativa.

`BUILD_PROFILE` selecciona `public` (predeterminado) o `personal`, rechaza valores desconocidos y emite `dist/public` o `dist/personal`. Las rutas públicas se trasladan sin cambios a `src/routes` y se inyectan desde configuración. La entrada personal sigue siendo `local/danna.astro`. En desarrollo se conserva el laboratorio y la vista local. El build personal no copia `public/`: solo favicon mediante allowlist. El layout admite una URL pública opcional para que los enlaces personales funcionen sin añadir landing/demo al artefacto personal.

Los comandos de build abortan si el perfil de entorno contradice el solicitado y ejecutan gates sobre todos los archivos, rutas exactas, recursos y referencias transitivas a chunks. El público conserva su gate anterior. Vitest ejercita casos negativos y `verify` compila ambos. No subir `dist` completo ni reutilizar un proyecto Vercel para ambos perfiles.

La seguridad reside en Deployment Protection con All Deployments o Cloudflare Access cubriendo todos los dominios y archivos, no en flags de build, robots, noindex o JavaScript cliente. Un build local correcto no verifica el acceso remoto. La primera prueba remota debe usar datos inocuos antes de generar cualquier despliegue personal. Vercel Authentication permite actualmente producción en todos los planes; confirmar alcance y permisos efectivos en la cuenta. Procedimiento y fuentes en la [guía operativa](../deployment-profiles.md).

Reversión: retirar el perfil personal y su hook de favicon; conservar el perfil público y el documento local para desarrollo. No hay migración de datos, dependencia nueva ni cambio de contrato o animaciones.
