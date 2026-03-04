import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const backendDir = dirname(fileURLToPath(import.meta.url));
const root = join(backendDir, '..', '..');

try {
  const dotenv = await import('dotenv');
  dotenv.default.config({ path: join(root, '.env') });
} catch {}

const port = process.env.JSON_SERVER_PORT || '3002';
const binPath = join(root, 'node_modules', 'json-server-auth', 'dist', 'bin.js');
const dbPath = join(backendDir, 'db.json');
const routesPath = join(backendDir, 'routes.json');

const proc = spawn(
  process.execPath,
  [binPath, dbPath, '--port', port, '-r', routesPath],
  { stdio: 'inherit', cwd: root }
);
proc.on('exit', (code) => process.exit(code ?? 0));
