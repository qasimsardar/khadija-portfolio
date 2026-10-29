// Tiny Worker in front of /video/* only (see run_worker_first in wrangler.jsonc). Everything else is served straight
// from static assets. Workers static assets ignore Range requests, and Safari on iOS won't play an MP4 unless the
// server answers them with 206 Partial Content, so this streams just the requested byte range.

const VIDEO_HEADERS = {
  'Accept-Ranges': 'bytes',
  'Cache-Control': 'public, max-age=604800',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

/** File sizes written at build time (src/pages/video/sizes.json.ts), used when the asset response has no length. */
let sizes;

export default {
  /**
   * @param {Request} request
   * @param {{ ASSETS: { fetch(input: Request | string | URL, init?: RequestInit): Promise<Response> } }} env
   */
  async fetch(request, env) {
    const url = new URL(request.url);
    const range = request.headers.get('Range');
    if (request.method !== 'GET' || url.pathname.endsWith('.json')) return env.ASSETS.fetch(request);

    const headers = new Headers(request.headers);
    headers.delete('Range');
    const res = await env.ASSETS.fetch(new Request(url, { method: 'GET', headers }));
    if (res.status !== 200 || !res.body) return res;

    const out = new Headers(res.headers);
    for (const [k, v] of Object.entries(VIDEO_HEADERS)) out.set(k, v);
    if (!range) return new Response(res.body, { status: 200, headers: out });

    const total = Number(res.headers.get('Content-Length')) || (await sizeOf(env, url));
    // Without a known size the range can't be answered; the full file still plays everywhere except iOS Safari.
    if (!total) return new Response(res.body, { status: 200, headers: out });

    const r = parseRange(range, total);
    if (!r) {
      await res.body.cancel();
      out.set('Content-Range', `bytes */${total}`);
      out.delete('Content-Length');
      return new Response(null, { status: 416, headers: out });
    }

    const [start, end] = r;
    const length = end - start + 1;
    out.set('Content-Range', `bytes ${start}-${end}/${total}`);
    out.set('Content-Length', String(length));
    // FixedLengthStream lets the runtime send a real Content-Length for a streamed body.
    const { readable, writable } = new FixedLengthStream(length);
    slice(res.body, start, end).pipeTo(writable).catch(() => {});
    return new Response(readable, { status: 206, headers: out });
  },
};

async function sizeOf(env, url) {
  if (!sizes) {
    try {
      const r = await env.ASSETS.fetch(new URL('/video/sizes.json', url));
      sizes = r.ok ? await r.json() : {};
    } catch {
      sizes = {};
    }
  }
  return sizes[url.pathname] || 0;
}

/** Single range only ("bytes=a-b", "bytes=a-", "bytes=-n"); returns inclusive [start, end] or null if unsatisfiable. */
function parseRange(header, total) {
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!m || (m[1] === '' && m[2] === '')) return null;
  let start;
  let end;
  if (m[1] === '') {
    const suffix = Number(m[2]);
    if (suffix === 0) return null;
    start = Math.max(0, total - suffix);
    end = total - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === '' ? total - 1 : Math.min(Number(m[2]), total - 1);
  }
  if (start >= total || start > end) return null;
  return [start, end];
}

/** Pass through bytes start..end (inclusive) of a stream without buffering the whole file. */
function slice(body, start, end) {
  const reader = body.getReader();
  let pos = 0;
  return new ReadableStream({
    async pull(controller) {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) return controller.close();
        const from = pos;
        pos += value.byteLength;
        if (pos <= start) continue;
        controller.enqueue(value.subarray(Math.max(0, start - from), Math.min(value.byteLength, end + 1 - from)));
        if (pos > end) {
          controller.close();
          await reader.cancel();
        }
        return;
      }
    },
    cancel(reason) {
      return reader.cancel(reason);
    },
  });
}
