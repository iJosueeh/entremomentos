import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import hooks from 'eslint-plugin-react-hooks';
import a11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

export default defineConfig(
  { ignores: ['dist/**', '.astro/**', 'node_modules/**', 'coverage/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs['flat/recommended'],
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  {
    files: ['**/*.tsx'],
    plugins: { 'react-hooks': hooks, 'jsx-a11y': a11y },
    rules: {
      ...hooks.configs.recommended.rules,
      ...a11y.configs.recommended.rules,
    },
  },
  {
    files: ['src/features/story-player/components/scenes/LetterScene.tsx'],
    rules: {
      // A named scroll region needs Tab access in browsers without automatic scroll focus.
      'jsx-a11y/no-noninteractive-tabindex': [
        'error',
        { roles: ['tabpanel', 'region'] },
      ],
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
);
