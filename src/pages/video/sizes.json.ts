// Build-time map of video file sizes (path -> bytes), read by worker/index.js to answer Range requests.
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export function GET() {
  const dir = join(process.cwd(), 'public', 'video');
  const sizes = Object.fromEntries(readdirSync(dir).map((f) => [`/video/${f}`, statSync(join(dir, f)).size]));
  return new Response(JSON.stringify(sizes), { headers: { 'Content-Type': 'application/json' } });
}
