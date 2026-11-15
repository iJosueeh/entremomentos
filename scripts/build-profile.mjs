import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

const profile = process.argv[2];
assert(
  ['public', 'personal', 'unified'].includes(profile),
  'Perfil desconocido',
);
assert(
  !process.env.BUILD_PROFILE || process.env.BUILD_PROFILE === profile,
  'BUILD_PROFILE no coincide con el comando: abortando para evitar mezclar artefactos',
);
const result = spawnSync(
  process.execPath,
  ['node_modules/astro/bin/astro.mjs', 'build'],
  {
    stdio: 'inherit',
    env: { ...process.env, BUILD_PROFILE: profile },
  },
);
assert.equal(result.status, 0, 'Falló el build');
const check = spawnSync(
  process.execPath,
  ['scripts/check-profile-build.mjs', profile],
  {
    stdio: 'inherit',
  },
);
process.exit(check.status ?? 1);
