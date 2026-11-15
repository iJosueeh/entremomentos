# Historia romántica local v1 — 2026-11-15

Estado: **implementada; QA visual y de interacción real pendiente**. Este informe sustituye el bloqueo anterior: el usuario proporcionó el contenido completo y autorizó una extensión compatible del contrato para dedicatorias sin recuerdos.

## Implementación

- Documento independiente en `src/features/story-player/local/danna-story.ts`, validado con Story V2. Conserva los textos aprobados, los ocho párrafos completos de la carta y su firma. No contiene fechas, recuerdos ni imágenes.
- Story V2 admite `memories: []`; mantiene obligatoria una fecha ISO válida para cada recuerdo que sí exista y todas las otras restricciones. No cambia V1.
- Las seis escenas usan el mismo Story Player. Memories presenta únicamente los dos párrafos aprobados sobre su atmósfera abstracta. No hay galería ficticia, placeholders fotográficos, índice vacío ni ecos de recuerdos inexistentes.
- La ruta se inyecta solo durante desarrollo en `/para/danna/`, desde un entrypoint fuera de `pages`. Documento y CSS locales no se exportan por las entradas públicas de la feature. No se ha añadido contenido a `public/`.
- Se reutilizan el cielo, constelaciones y navegación existentes. LetterScene fue refinada después de esta v1: ahora usa una superficie modal nativa con cabecera/cierre separados del cuerpo desplazable y una sola timeline GSAP reversible desde el sobre. Bloquea/restaura scroll y devuelve foco al finalizar el cierre. Sin JS e impresión muestran el mensaje completo. La mejora visual es compartida con `/demo`; sus datos no cambian. Se retiraron las filas reservadas y el cierre sticky locales. Véase [QA del refinamiento](letter-refinement.md).

## Abrir localmente

```bash
cd ~/Documentos/Proyectos/entremomentos
npm run dev -- --host 127.0.0.1
```

Abrir `http://127.0.0.1:4321/para/danna/`. No compartir ni publicar el servidor de desarrollo: no hay autenticación. La exclusión del build protege el artefacto público; no protege un servidor dev expuesto. No se utiliza `noindex` como barrera.

## Evidencia automática

La suite contiene `tests/story-dedication.test.ts`: valida el documento vacío, compatibilidad de la muestra anterior, fechas obligatorias para recuerdos reales, las seis escenas SSR en orden, textos, carta completa en una sola copia, firma, ocho anclas con destino y ausencia de fechas, fotos, visor fotográfico e índices ficticios. El diálogo de carta es independiente del visor de recuerdos. También prueba otra dedicatoria para evitar dependencia del nombre en el renderer.

La suite existente de carta comprueba estado inicial cerrado tras conectar, apertura/cierre, Escape, foco, inversión rápida, importaciones tardías, limpieza y movimiento reducido mediante dobles DOM/GSAP. No equivale a probar la nueva carta en un navegador real. Las pruebas previas de demo, navegación, medios, geometría y movimiento se conservan.

Se compararon hashes de `src/pages/demo.astro` y de `demoStory`: ambos intactos. No hay repositorio Git reconocible; no se inicializó ni se hicieron commits/push. El gate completo terminó con código 0: Astro check (80 archivos, cero diagnósticos), lint, formato, 15 archivos/152 pruebas y build público de dos páginas. El hook real de configuración registró dos rutas locales en dev y ninguna en build/preview. Una prueba negativa con contenido privado en un source map temporal fue rechazada; el archivo se retiró y el artefacto limpio pasó de nuevo. Una revisión independiente de código no encontró hallazgos materiales. Estos resultados corresponden a la implementación inicial; los del refinamiento de LetterScene están al comienzo de [verificación](../verification.md).

## Comprobar el artefacto público

```bash
npm run verify
# Si ya existe un build recién generado:
node scripts/check-story-build.mjs
```

El script incluido en `verify` recorre todos los archivos de `dist`, incluidos chunks, CSS, propiedades serializadas de islas y source maps si existen. Rechaza el nombre del destinatario, firma, fragmentos exclusivos de la carta, rutas y marcadores CSS de la previsualización. No basta con comprobar que falte un HTML. El build debe continuar generando únicamente `/` y `/demo`. Repetir este gate después de cambiar imports, contenido, entrypoints o configuración.

Comprobación complementaria en una terminal local:

```bash
npm run preview -- --host 127.0.0.1
curl -I http://127.0.0.1:4321/para/danna/
```

La ruta debe devolver 404 (usar el puerto que indique Astro si es distinto). La respuesta HTTP por sí sola no prueba la exclusión de datos de otros archivos. No se ha configurado hosting ni desplegado.

## Limitaciones y QA manual pendiente

Intentos reales en este entorno: Astro dev salió con código 1 antes de ready (`/tmp/entremomentos-danna-dev.log`); Firefox headless falló con segfault/código 139 incluso en `about:blank` (`/tmp/entremomentos-danna-firefox.log`); curl no pudo abrir socket, «Operation not permitted». No hay captura válida ni comprobación HTTP de la ruta, hidratación o interacción en navegador.

Revisar localmente a 320, 390, 768, 1024 y 1440 px y zoom 200%: las seis escenas, lectura, ausencia de overflow horizontal, anclas/teclado y constelaciones. Abrir y cerrar la carta larga con botón y Escape, invertir rápidamente y redimensionar durante la animación; revisar scroll interno hasta la firma, cabecera con cierre separado, foco, ausencia de recortes y posición estable del epílogo. Confirmar sobre cerrado tras hidratar, carta completa sin JS, impresión y fuentes sin red. Probar movimiento reducido inicial/en vivo y pausa independiente. Comparar `/demo` y comprobar 404 en preview del build. No se declara QA responsive, fluidez o interacción real aprobada sin esas comprobaciones.
