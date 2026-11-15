import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { checkProfileBuild } from '../scripts/check-profile-build.mjs';

const directories = [];
afterEach(async () => {
  await Promise.all(
    directories
      .splice(0)
      .map((directory) => rm(directory, { recursive: true, force: true })),
  );
});

async function personalFixture() {
  const directory = await mkdtemp(join(tmpdir(), 'entremomentos-profile-'));
  directories.push(directory);
  await mkdir(join(directory, 'para/danna'), { recursive: true });
  await writeFile(join(directory, 'favicon.svg'), '<svg/>');
  await writeFile(
    join(directory, 'para/danna/index.html'),
    'Danna, qué bonito que existas Con mucho cariño, Josue <astro-island>' +
      ['intro', 'connection', 'memories', 'discovery', 'letter', 'epilogue']
        .map((scene) => `<section data-scene="${scene}"></section>`)
        .join('') +
      '</astro-island>',
  );
  return directory;
}

describe('build artifact isolation gate', () => {
  it('requires the personal route, complete SSR and hydration', async () => {
    const directory = await personalFixture();
    await expect(
      checkProfileBuild('personal', directory),
    ).resolves.toBeUndefined();
    await rm(join(directory, 'para/danna/index.html'));
    await expect(checkProfileBuild('personal', directory)).rejects.toThrow(
      'Rutas inesperadas',
    );
  });

  it('rejects landing and demo routes in the personal output', async () => {
    const directory = await personalFixture();
    await writeFile(join(directory, 'index.html'), 'Landing');
    await expect(checkProfileBuild('personal', directory)).rejects.toThrow(
      'Rutas inesperadas',
    );
  });

  it('rejects unused chunks and copied media', async () => {
    const directory = await personalFixture();
    await mkdir(join(directory, '_astro'));
    await writeFile(join(directory, '_astro/extra.js'), 'export default 1;');
    await expect(checkProfileBuild('personal', directory)).rejects.toThrow(
      'Chunk sin referencia',
    );
    await rm(join(directory, '_astro/extra.js'));
    await writeFile(join(directory, 'photo.webp'), 'photo');
    await expect(checkProfileBuild('personal', directory)).rejects.toThrow(
      'Recursos estáticos inesperados',
    );
  });

  it('rejects a personal payload hidden in a public chunk', async () => {
    const directory = await personalFixture();
    await rm(join(directory, 'para'), { recursive: true });
    await mkdir(join(directory, 'demo'));
    await mkdir(join(directory, 'images'));
    await mkdir(join(directory, '_astro'));
    await writeFile(
      join(directory, 'index.html'),
      '<script src="/_astro/island.js"></script>',
    );
    await writeFile(join(directory, 'demo/index.html'), 'Demo');
    for (const name of [
      'credits.json',
      'demo-forest-large.webp',
      'demo-forest.webp',
      'demo-mountain.webp',
      'demo-winter.webp',
    ]) {
      await writeFile(join(directory, 'images', name), 'fixture');
    }
    await writeFile(
      join(directory, '_astro/island.js'),
      'export default "Danna";',
    );
    await expect(checkProfileBuild('public', directory)).rejects.toThrow(
      'Contenido personal incluido',
    );
    await writeFile(
      join(directory, '_astro/island.js'),
      'export default "demo";',
    );
    await expect(
      checkProfileBuild('public', directory),
    ).resolves.toBeUndefined();
  });
});
