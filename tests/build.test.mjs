import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { checkBuild } from '../scripts/check-build.mjs';

const directories = [];
afterEach(async () => {
  await Promise.all(
    directories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

async function buildFixture() {
  const directory = await mkdtemp(join(tmpdir(), 'entremomentos-build-'));
  directories.push(directory);
  for (const path of ['para/danna', 'demo', 'images'])
    await mkdir(join(directory, path), { recursive: true });
  await writeFile(join(directory, 'favicon.svg'), '<svg/>');
  await writeFile(join(directory, 'index.html'), '<a href="/demo/">Demo</a>');
  await writeFile(join(directory, 'demo/index.html'), 'Demo');
  await writeFile(
    join(directory, 'para/danna/index.html'),
    '<meta name="robots" content="noindex, nofollow">Danna, qué bonito que existas Con mucho cariño, Josue <astro-island>' +
      ['intro', 'connection', 'memories', 'discovery', 'letter', 'epilogue']
        .map((scene) => `<section data-scene="${scene}"></section>`)
        .join('') +
      '</astro-island>',
  );
  for (const name of [
    'credits.json',
    'demo-forest-large.webp',
    'demo-forest.webp',
    'demo-mountain.webp',
    'demo-winter.webp',
  ])
    await writeFile(join(directory, 'images', name), 'fixture');
  return directory;
}

describe('production build gate', () => {
  it('accepts all three routes and the approved dedication', async () => {
    await expect(checkBuild(await buildFixture())).resolves.toBeUndefined();
  });

  it.each(['index.html', 'demo/index.html', 'para/danna/index.html'])(
    'requires route %s',
    async (file) => {
      const directory = await buildFixture();
      await rm(join(directory, file));
      await expect(checkBuild(directory)).rejects.toThrow('Rutas inesperadas');
    },
  );

  it('rejects legacy profile output and extra routes', async () => {
    const directory = await buildFixture();
    await mkdir(join(directory, 'public'));
    await writeFile(join(directory, 'public/index.html'), 'Legacy');
    await expect(checkBuild(directory)).rejects.toThrow('Rutas inesperadas');
  });

  it.each(['index.html', 'demo/index.html'])(
    'rejects personal references in %s',
    async (file) => {
      const directory = await buildFixture();
      await writeFile(
        join(directory, file),
        '<meta name="description" content="Danna">',
      );
      await expect(checkBuild(directory)).rejects.toThrow(
        'Contenido personal incluido',
      );
    },
  );

  it('requires noindex on the dedication', async () => {
    const directory = await buildFixture();
    const file = join(directory, 'para/danna/index.html');
    await writeFile(
      file,
      (await readFile(file, 'utf8')).replace(
        '<meta name="robots" content="noindex, nofollow">',
        '',
      ),
    );
    await expect(checkBuild(directory)).rejects.toThrow();
  });

  it('rejects photographs in the dedication', async () => {
    const directory = await buildFixture();
    const file = join(directory, 'para/danna/index.html');
    await writeFile(
      file,
      (await readFile(file, 'utf8')) + '<img src="/images/demo-forest.webp">',
    );
    await expect(checkBuild(directory)).rejects.toThrow(
      'La dedicatoria aprobada no contiene fotos',
    );
  });

  it('rejects missing local resources', async () => {
    const directory = await buildFixture();
    await writeFile(join(directory, 'index.html'), '<img src="/missing.webp">');
    await expect(checkBuild(directory)).rejects.toThrow(
      'Recurso o enlace local faltante',
    );
  });

  it('rejects unused chunks and unapproved media', async () => {
    const directory = await buildFixture();
    await mkdir(join(directory, '_astro'));
    await writeFile(join(directory, '_astro/extra.js'), 'export default 1;');
    await expect(checkBuild(directory)).rejects.toThrow('Chunk sin referencia');
    await rm(join(directory, '_astro/extra.js'));
    await writeFile(join(directory, 'photo.webp'), 'photo');
    await expect(checkBuild(directory)).rejects.toThrow(
      'Recursos estáticos inesperados',
    );
  });

  it('rejects laboratory code in reachable chunks', async () => {
    const directory = await buildFixture();
    await mkdir(join(directory, '_astro'));
    await writeFile(
      join(directory, 'index.html'),
      '<script src="/_astro/lab.js"></script>',
    );
    await writeFile(
      join(directory, '_astro/lab.js'),
      'console.log("Laboratorio GSAP");',
    );
    await expect(checkBuild(directory)).rejects.toThrow('Laboratorio incluido');
  });
});
