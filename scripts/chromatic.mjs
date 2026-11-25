// Local Chromatic run: loads CHROMATIC_PROJECT_TOKEN from .env (storybook/.env, then the project root ../.env —
// both are git-ignored), then runs the Chromatic CLI with the repo's settings (chromatic.config.json).
// Extra args pass through: `npm run chromatic -- --only-story-names "Actions/button-front/*"`.
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
for (const file of [path.join(root, '.env'), path.join(root, '..', '.env')]) {
  if (existsSync(file)) process.loadEnvFile(file);
}

if (!process.env.CHROMATIC_PROJECT_TOKEN) {
  console.error(
    'CHROMATIC_PROJECT_TOKEN is not set.\n' +
      'Add the line CHROMATIC_PROJECT_TOKEN=chpt_... to "D:/Agents/Store Front/.env" (project token from\n' +
      'chromatic.com → your project → Manage → Configure). See README.md → «Chromatic».',
  );
  process.exit(1);
}

const res = spawnSync('npx', ['chromatic', ...process.argv.slice(2)], { cwd: root, stdio: 'inherit', shell: true });
process.exit(res.status ?? 1);
