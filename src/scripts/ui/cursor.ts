// Custom cursor (mouse/trackpad only): a small dot that grows into a labelled circle over [data-cursor]
// targets and takes the accent of the nearest [data-accent] block. Purely decorative (aria-hidden).
import gsap from 'gsap';

function readableOn(hex: string): string {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m) return '#fefbf4';
  const [r, g, b] = m.map((v) => parseInt(v, 16) / 255);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.55 ? '#141414' : '#fefbf4';
}

export function initCursor() {
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine) return;
  const root = document.documentElement;
  const apply = () => root.classList.add('has-cursor');
  apply();
  document.addEventListener('astro:after-swap', apply);

  const el = () => document.querySelector<HTMLElement>('[data-cursor-el]');
  let node = el();
  if (!node) return;
  let xTo = gsap.quickTo(node, 'x', { duration: 0.5, ease: 'power3.out' });
  let yTo = gsap.quickTo(node, 'y', { duration: 0.5, ease: 'power3.out' });
  document.addEventListener('astro:after-swap', () => {
    // The element persists across navigations, but re-bind defensively.
    const n = el();
    if (n && n !== node) {
      node = n;
      xTo = gsap.quickTo(node, 'x', { duration: 0.5, ease: 'power3.out' });
      yTo = gsap.quickTo(node, 'y', { duration: 0.5, ease: 'power3.out' });
    }
  });

  let current: Element | null = null;
  const label = () => node!.querySelector<HTMLElement>('[data-cursor-label]')!;

  const update = (target: Element | null) => {
    const hit = target?.closest('[data-cursor], a, button, [role="slider"], input[type="range"]') ?? null;
    if (hit === current) return;
    current = hit;
    const text = hit instanceof HTMLElement ? (hit.dataset.cursor ?? '') : '';
    root.classList.toggle('cursor-active', !!hit && text !== '');
    root.classList.toggle('cursor-hover', !!hit && text === '');
    if (text) label().textContent = text;
    const accent = hit?.closest<HTMLElement>('[data-accent]')?.dataset.accent || '#141414';
    node!.style.setProperty('--cursor-bg', accent);
    node!.style.setProperty('--cursor-fg', readableOn(accent));
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      root.classList.remove('cursor-out');
      xTo(e.clientX);
      yTo(e.clientY);
      update(e.target as Element);
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => root.classList.add('cursor-out'));
  // Page content changes under a still pointer after navigation.
  document.addEventListener('astro:page-load', () => {
    current = null;
    root.classList.remove('cursor-active', 'cursor-hover');
  });
}
