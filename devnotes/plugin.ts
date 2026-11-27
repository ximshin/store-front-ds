// Dev-only design notes: injects the notes panel (client.js) into the dev server pages and stores notes
// in <project>/.tmp/devnotes/ (notes.json + one PNG per screenshot). `apply: 'serve'` keeps it out of every build;
// skipped under Vitest and `npm run storybook` so stories and their browser tests stay clean.
// Note shape: { id, status: open|done, route, viewport, target: { components[{name,file}], selector, scopeId, rect },
//               changes[{property, from (computed), to}], comment, screenshot (file name) }.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Plugin } from 'vite';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(here, '../../.tmp/devnotes');
const NOTES = path.join(OUT_DIR, 'notes.json');
const CLIENT = path.join(here, 'client.js');
const API = '/__devnotes';

interface Note {
  id: string;
  status: 'open' | 'done';
  screenshot?: string | null;
  [key: string]: unknown;
}

function readNotes(): Note[] {
  try {
    return JSON.parse(fs.readFileSync(NOTES, 'utf8')) as Note[];
  } catch {
    return [];
  }
}

function writeNotes(notes: Note[]): void {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(NOTES, JSON.stringify(notes, null, 2) + '\n');
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', (chunk: string) => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function send(res: ServerResponse, status: number, body: unknown, type = 'application/json'): void {
  res.statusCode = status;
  res.setHeader('Content-Type', type);
  res.setHeader('Cache-Control', 'no-store');
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

function saveScreenshot(id: string, dataUrl: unknown): string | null {
  if (typeof dataUrl !== 'string') return null;
  const m = /^data:image\/(png|jpeg);base64,(.+)$/.exec(dataUrl);
  if (!m) return null;
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const file = `${id}.${m[1] === 'jpeg' ? 'jpg' : 'png'}`;
  fs.writeFileSync(path.join(OUT_DIR, file), Buffer.from(m[2], 'base64'));
  return file;
}

export function devNotes(): Plugin {
  return {
    name: 'store-front-devnotes',
    apply: (_config, env) =>
      env.command === 'serve' && !process.env.VITEST && process.env.npm_lifecycle_event !== 'storybook',
    transformIndexHtml: {
      order: 'post',
      handler: () => [{ tag: 'script', attrs: { type: 'module', src: `${API}/client.js` }, injectTo: 'body' }],
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? '';
        if (!url.startsWith(API)) return next();
        const route = url.slice(API.length).split('?')[0];
        try {
          if (route === '/client.js') return send(res, 200, fs.readFileSync(CLIENT, 'utf8'), 'text/javascript');

          if (route === '/notes' && req.method === 'GET') return send(res, 200, readNotes());

          if (route === '/notes' && req.method === 'POST') {
            const note = JSON.parse(await readBody(req)) as Note;
            note.id = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14) + '-' + Math.random().toString(36).slice(2, 6);
            note.status = 'open';
            note.screenshot = saveScreenshot(note.id, note.screenshot);
            const notes = readNotes();
            notes.push(note);
            writeNotes(notes);
            return send(res, 200, note);
          }

          const one = /^\/notes\/([\w-]+)$/.exec(route);
          if (one && req.method === 'DELETE') {
            const notes = readNotes();
            const gone = notes.find((n) => n.id === one[1]);
            if (gone?.screenshot) fs.rmSync(path.join(OUT_DIR, gone.screenshot), { force: true });
            writeNotes(notes.filter((n) => n.id !== one[1]));
            return send(res, 200, { ok: true });
          }

          const shot = /^\/shots\/([\w.-]+\.(?:png|jpg))$/.exec(route);
          if (shot && req.method === 'GET') {
            const file = path.join(OUT_DIR, shot[1]);
            if (!fs.existsSync(file)) return send(res, 404, { error: 'not found' });
            return send(res, 200, fs.readFileSync(file), shot[1].endsWith('.png') ? 'image/png' : 'image/jpeg');
          }

          return send(res, 404, { error: 'unknown route' });
        } catch (e) {
          return send(res, 500, { error: String(e) });
        }
      });
    },
  };
}
