import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [
    react(),
    {
      name: 'entremomentos-routes',
      hooks: {
        'astro:config:setup': ({ command, injectRoute }) => {
          injectRoute({
            pattern: '/',
            entrypoint: './src/routes/index.astro',
          });
          injectRoute({
            pattern: '/demo',
            entrypoint: './src/routes/demo.astro',
          });
          injectRoute({
            pattern: '/para/danna/',
            entrypoint: './src/features/story-player/local/danna.astro',
          });
          if (command === 'dev') {
            injectRoute({
              pattern: '/dev/gsap',
              entrypoint: './src/features/story-player/dev/lab.astro',
            });
          }
        },
      },
    },
  ],
  vite: { plugins: [tailwindcss()] },
});
