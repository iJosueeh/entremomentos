# ADR 014 — Build estándar de Astro

Estado: implementado. Sustituye los perfiles de ADR 012 y ADR 013 por decisión definitiva del usuario para esta versión.

Un solo proyecto Astro y el proyecto Vercel existente sirven `/`, `/demo/` y `/para/danna/` mediante `npm run build`, con salida estándar `dist/`. Se retiran `outDir`, `publicDir`, la selección `BUILD_PROFILE`, el runner y los comandos de perfiles. Astro copia normalmente `public/` y limpia su salida al compilar; no se añade un script propio de limpieza.

Se conserva el registro explícito de las tres entradas existentes y del laboratorio exclusivamente con `command === 'dev'`. No se mueven documentos ni se modifica Story V2, renderer, narrativa, componentes, hooks, estilos o animaciones. La cabecera usa enlaces relativos al mismo sitio; se retira la URL opcional que solo necesitaba el despliegue personal separado.

Los gates se simplifican a un único artefacto, manteniendo rutas exactas, allowlist de recursos, referencias locales, chunks alcanzables, SSR/hidratación y noindex de Danna, ausencia de fotos personales y de laboratorio. Se retiran únicamente las pruebas de aislamiento de perfiles que ya no existen; se conservan y amplían las comprobaciones aplicables al build único.

Danna sigue siendo pública sin control de acceso por decisión expresa. Noindex es una indicación de indexación; no protege contenido. No se incorporan fotos ni datos privados adicionales. No hay sitemap. Un requisito futuro de acceso restringido necesitará una decisión independiente.

Configuración del único Vercel: Astro, build `npm run build`, output `dist`, Node 24 compatible con engines y sin variables de perfil. No se despliega, crea otro proyecto, ejecuta commit o push. [Guía operativa](../deployment-profiles.md).
