import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { copyFile } from 'node:fs/promises';

const profile = process.env.BUILD_PROFILE ?? 'public';
if (!['public', 'personal'].includes(profile)) {
  throw new Error('BUILD_PROFILE debe ser public o personal');
}
const personal = profile === 'personal';

export default defineConfig({
  outDir: personal ? './dist/personal' : './dist/public',
  // No personal static directory exists; copy only the allowlisted favicon below.
  publicDir: personal ? './public-personal' : './public',
  integrations: [
    react(),
    {
      name: 'entremomentos-build-profile',
      hooks: {
        'astro:config:setup': ({ command, injectRoute }) => {
          if (!personal) {
            injectRoute({
              pattern: '/',
              entrypoint: './src/routes/index.astro',
            });
            injectRoute({
              pattern: '/demo',
              entrypoint: './src/routes/demo.astro',
            });
          }
          if (personal || command === 'dev') {
            injectRoute({
              pattern: '/para/danna/',
              entrypoint: './src/features/story-player/local/danna.astro',
            });
          }
          if (command === 'dev') {
            injectRoute({
              pattern: '/dev/gsap',
              entrypoint: './src/features/story-player/dev/lab.astro',
            });
          }
        },
        'astro:build:done': async ({ dir }) => {
          if (personal) {
            // Explicit allowlist: never copy demo media or future public files.
            await copyFile(
              new URL('./public/favicon.svg', import.meta.url),
              new URL('favicon.svg', dir),
            );
          }
        },
      },
    },
  ],
  vite: { plugins: [tailwindcss()] },
});
