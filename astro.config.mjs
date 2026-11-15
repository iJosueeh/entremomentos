import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [
    react(),
    {
      name: 'entremomentos-development-lab',
      hooks: {
        'astro:config:setup': ({ command, injectRoute }) => {
          if (command === 'dev') {
            injectRoute({
              pattern: '/dev/gsap',
              entrypoint: './src/features/story-player/dev/lab.astro',
            });
            injectRoute({
              pattern: '/para/danna/',
              entrypoint: './src/features/story-player/local/danna.astro',
            });
          }
        },
      },
    },
  ],
  vite: { plugins: [tailwindcss()] },
});
