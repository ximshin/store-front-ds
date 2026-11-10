// Screenshot stories from the static Storybook build, for visual comparison with Figma.
// Usage: npm run build-storybook && node scripts/screenshot.mjs [--static-dir <dir>] <story-id> [<story-id> ...]
// Output: .tmp/screens/<story-id>.png (in the project root)
// --static-dir lets parallel workers build into their own folder (npm run build-storybook -- --output-dir <dir>).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const sdIdx = args.indexOf('--static-dir');
const staticDir = sdIdx >= 0 ? path.resolve(args.splice(sdIdx, 2)[1]) : path.join(root, 'storybook-static');
const outDir = path.join(root, '..', '.tmp', 'screens');
const ids = args;
if (!ids.length) throw new Error('Pass at least one story id, e.g. actions-button--all-variants');
if (!fs.existsSync(staticDir)) throw new Error('storybook-static not found — run `npm run build-storybook` first');

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const p = path.join(staticDir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(staticDir) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(p)] ?? 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 2400, height: 1200 } });
for (const id of ids) {
  await page.goto(`http://localhost:${port}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // shrink-wrap the story so wide grids are captured whole instead of being clipped to the viewport
  await page.addStyleTag({ content: '#storybook-root{display:inline-block!important;width:max-content!important}' });
  const el = page.locator('#storybook-root');
  const file = path.join(outDir, `${id}.png`);
  await el.screenshot({ path: file });
  console.log(file);
}
await browser.close();
server.close();
