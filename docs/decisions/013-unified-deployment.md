# ADR 013 — Un despliegue con tres rutas

Estado: implementado localmente. Sustituye para v1 la decisión de dos proyectos de ADR 012 por petición explícita del usuario; mantiene sus perfiles separados para usos posteriores.

El proyecto existente `entremomentos.vercel.app` servirá Landing, Demo y Danna en `/`, `/demo/` y `/para/danna/`. Se acepta expresamente que la dedicatoria sea pública por enlace directo, sin autenticación. No se desplegó ni se creó otro proyecto.

Se añade `unified` como perfil explícito y predeterminado, con salida `dist/unified`. Las entradas se inyectan desde Astro sin mover o duplicar documentos, renderer, Story V2, escenas, hooks o animaciones. Build y preview predeterminados usan unified; los comandos separados se conservan. Verify compila los tres y ejecuta sus gates.

BaseLayout admite un flag opcional noindex que solo activa Danna; su cabecera enlaza a las rutas del mismo sitio en unified. No hay sitemap. Landing y Demo no mencionan la dedicatoria. Los gates mantienen aislamiento en los perfiles separados y permiten la dedicatoria solo en su ruta para unified, con SSR completo, noindex y sin fotografías. Se comprueban referencias locales y ausencia del laboratorio.

Noindex regula indexación y no restringe acceso. Esta versión no protege el contenido: cualquiera con el enlace puede acceder a HTML, props y recursos. No se añaden fotos personales ni datos adicionales. La eventual privacidad se resolverá fuera del Story Player y exige una decisión posterior sobre hosting/autenticación.

Reversión: seleccionar `build:public` y `dist/public` y quitar una variable `BUILD_PROFILE=unified` o cambiarla a public. Esto excluye Danna de nuevos artefactos; no elimina despliegues anteriores ni copias ya compartidas. No hay migración de datos.

Configuración y comandos en [despliegue](../deployment-profiles.md); evidencia y límites en [QA](../qa/unified-deployment.md).
