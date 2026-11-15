import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const publicAssets = [
  'favicon.svg',
  'images/credits.json',
  'images/demo-forest-large.webp',
  'images/demo-forest.webp',
  'images/demo-mountain.webp',
  'images/demo-winter.webp',
];

export async function checkProfileBuild(profile, directory) {
  assert(['public', 'personal'].includes(profile), 'Perfil desconocido');
  const personal = profile === 'personal';
  const expectedRoutes = personal
    ? ['para/danna/index.html']
    : ['demo/index.html', 'index.html'];
  const assets = personal ? ['favicon.svg'] : publicAssets;
  const entries = await readdir(directory, {
    recursive: true,
    withFileTypes: true,
  });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) =>
      join(entry.parentPath, entry.name).slice(resolve(directory).length + 1),
    );
  assert.deepEqual(
    files.filter((file) => file.endsWith('.html')).sort(),
    expectedRoutes,
    'Rutas inesperadas',
  );
  assert.deepEqual(
    files
      .filter((file) => !file.endsWith('.html') && !file.startsWith('_astro/'))
      .sort(),
    [...assets].sort(),
    'Recursos estáticos inesperados',
  );
  const contents = new Map();
  for (const file of files) {
    assert(
      !file.startsWith('_astro/') || /\.(js|css)$/.test(file),
      `Chunk inesperado: ${file}`,
    );
    const content = await readFile(join(directory, file), 'utf8');
    contents.set(file, content);
    assert.doesNotMatch(
      file + content,
      /Laboratorio GSAP|Desmontar demostración|create-demo-animation|\.memory-stage/,
      `Laboratorio incluido: ${file}`,
    );
    if (personal) {
      assert.doesNotMatch(
        file + content,
        /\bAlma\b|\bNico\b|data-universe-hero|data-forest-anchor|demo-forest|demo-closure/,
        `Contenido público incluido: ${file}`,
      );
    } else {
      assert.doesNotMatch(
        file + content,
        /danna|josue|dedication-preview|Quería hacerte algo diferente|A veces siento que las palabras se quedan cortas|pequeño universo que hice pensando en ti/i,
        `Contenido personal incluido: ${file}`,
      );
    }
  }
  // Every emitted chunk must be reachable from a page, directly or through another chunk.
  const reached = new Set(expectedRoutes);
  const pending = [...expectedRoutes];
  while (pending.length) {
    const content = contents.get(pending.pop());
    for (const file of files.filter((file) => file.startsWith('_astro/'))) {
      if (
        !reached.has(file) &&
        content.includes(file.slice('_astro/'.length))
      ) {
        reached.add(file);
        pending.push(file);
      }
    }
  }
  for (const file of files.filter((file) => file.startsWith('_astro/'))) {
    assert(
      reached.has(file),
      `Chunk sin referencia desde las rutas previstas: ${file}`,
    );
  }
  if (personal) {
    const html = contents.get('para/danna/index.html');
    assert.match(html, /Danna, qué bonito que existas/);
    assert.match(html, /Con mucho cariño, Josue/);
    assert.deepEqual(
      [...html.matchAll(/data-scene="([^"]+)"/g)].map((match) => match[1]),
      ['intro', 'connection', 'memories', 'discovery', 'letter', 'epilogue'],
    );
    assert.match(html, /astro-island/);
  }
  console.log(
    `Perfil ${profile}: rutas, contenido y recursos aislados (${files.length} archivos).`,
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await checkProfileBuild(process.argv[2], resolve(`dist/${process.argv[2]}`));
}
