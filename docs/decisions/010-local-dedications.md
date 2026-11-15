# ADR 010 — Dedicatorias sin recuerdos y previsualización local

Estado: implementado; QA visual pendiente. Amplía de forma compatible ADR 004.

## Contrato y consumidores

Story V2 admite ahora 0–100 recuerdos, manteniendo el array obligatorio y las reglas de fecha ISO, unicidad, medios, versión, tema y seis escenas. Los documentos anteriores siguen validando sin conversión. Datos locales producen el documento, Astro valida y el Player recibe props; no hay persistencia ni consumidores externos en esta copia. V1 del laboratorio conserva su mínimo de un recuerdo.

Memories renderiza la introducción con párrafos separados por una línea vacía. Con un array vacío omite lista y visor; Discovery omite su índice y Epilogue sus ecos de recuerdos. Los ambientes y las seis escenas permanecen. El renderer no conoce destinatarios ni modos de publicación. La muestra ficticia no cambia. No se añaden recuerdos sin fecha ni fechas centinela.

## Privacidad y carta

La ruta `/para/danna/` se inyecta exclusivamente durante `astro dev`, siguiendo la exclusión ya usada por el laboratorio. Su entrypoint, documento validado y CSS viven en `features/story-player/local`, fuera de `pages` y `public`. No se exportan por `index.ts` ni `document.ts`. No hay hosting, autenticación ni publicación. Servir solo en loopback; no se confía en metadatos `noindex` para impedir acceso.

La composición inicial de carta se sustituyó por la superficie de lectura compartida de [ADR 011](011-letter-reading-surface.md): elimina filas reservadas, márgenes negativos y cierre sticky, mantiene una única timeline reversible y separa cabecera/cuerpo desplazable dentro de un diálogo nativo. El CSS local conserva solo el énfasis del mensaje final. Sin JavaScript y al imprimir, el texto permanece completo.

## Compatibilidad y reversión

Las pruebas conservan las historias anteriores y ejercitan dedicatorias vacías, rechazo de fechas inválidas, las seis escenas y todo el contenido aprobado. El gate público rechaza nombres de archivos, contenido y estilos exclusivos de la vista local en todos los archivos de `dist`, incluidos source maps si aparecen.

Para retirar la vista basta con quitar su inyección y los archivos locales. La ampliación del contrato puede conservarse; volver al mínimo de uno solo sería compatible con los documentos anteriores después de retirar todas las dedicatorias vacías. No requiere migrar datos existentes. Resultados y limitaciones en [QA Danna v1](../qa/danna-v1.md).
