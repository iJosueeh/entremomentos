import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';

const output = new URL('../dist/', import.meta.url);
const demo = await readFile(new URL('demo/index.html', output), 'utf8');
const landing = await readFile(new URL('index.html', output), 'utf8');
const demoMain = demo.match(/<main\b[^>]*\bid="contenido"[^>]*>/)?.[0];
assert(demoMain, 'La demo debe conservar el destino del skip link');
assert.doesNotMatch(
  demoMain,
  /\bclass="[^"]*\bwrap\b/,
  'El host del player debe permitir fondos a ancho completo',
);
assert.match(
  demo,
  /class="story-player__gallery-content"/,
  'La galería debe tener un plano editorial independiente del fondo',
);
const scenes = [
  'intro',
  'connection',
  'memories',
  'discovery',
  'letter',
  'epilogue',
];

assert.deepEqual(
  [...demo.matchAll(/data-scene="([^"]+)"/g)].map((match) => match[1]),
  scenes,
  'El HTML inicial debe contener las seis escenas en orden',
);
assert.match(
  demo,
  /Gracias por hacer espacio para las conversaciones sin prisa/,
);
assert.match(demo, /Aquella mañana caminamos sin decir mucho/);
const ids = new Set(
  [...demo.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]),
);
for (const [, target] of demo.matchAll(/href="#([^"]+)"/g)) {
  assert(ids.has(target), `Ancla sin destino: ${target}`);
}
assert.match(landing, /data-universe-hero/);
assert.equal([...landing.matchAll(/data-forest-anchor=/g)].length, 4);
assert.match(landing, /href="\/demo"/);

const files = await readdir(output, { recursive: true });
for (const file of files) {
  assert.doesNotMatch(
    file,
    /danna|dedication-preview/i,
    `Ruta privada: ${file}`,
  );
  const url = new URL(file, output);
  if (!(await stat(url)).isFile()) continue;
  // Scan every artifact, including source maps and serialized island props.
  const content = await readFile(url, 'utf8');
  assert.doesNotMatch(
    content,
    /danna|josue|dedication-preview|Quería hacerte algo diferente|A veces siento que las palabras se quedan cortas|pequeño universo que hice pensando en ti/i,
    `Dedicatoria local incluida en el artefacto público: ${file}`,
  );
}
assert(
  !files.some((file) => /(^|\/)dev(\/|$)/.test(file)),
  'El laboratorio no debe generar rutas',
);
for (const file of files.filter((file) => /\.(html|js|css)$/.test(file))) {
  assert(
    !/create-demo-animation/.test(file),
    'El laboratorio no debe generar chunks',
  );
  const content = await readFile(new URL(file, output), 'utf8');
  assert(
    !/Desmontar demostración|Laboratorio GSAP|\.memory-stage/.test(content),
    `Laboratorio incluido: ${file}`,
  );
  if (file.endsWith('.js'))
    assert(
      !/safeParse|Identificador de recuerdo duplicado/.test(content),
      `Validación incluida en el cliente: ${file}`,
    );
}
console.log(
  'Build: seis escenas SSR, anclas, landing y exclusión del laboratorio y la dedicatoria local aprobados.',
);

assert.equal(
  [...demo.matchAll(/<footer\b/g)].length,
  1,
  'La demo debe tener un solo footer',
);
assert.match(demo, /demo-closure/, 'La demo debe componer el cierre cromático');
assert.match(
  demo,
  /story-player__epilogue-content/,
  'El epílogo debe separar su composición del ambiente',
);
