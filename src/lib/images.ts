import type { ImageMetadata } from 'astro';

// Every exported design image, keyed by its path under src/assets (e.g. "prisma/hero.jpg").
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{jpg,png,webp}', {
  eager: true,
});

/**
 * Looks up an exported image. The extension is optional for JPG/PNG pairs; WebP assets use their exact path.
 */
export function asset(path: string): ImageMetadata {
  const stem = path.replace(/\.(jpg|png|webp)$/, '');
  const mod = files[`/src/assets/${stem}.jpg`] ?? files[`/src/assets/${stem}.png`] ?? files[`/src/assets/${stem}.webp`];
  if (!mod) throw new Error(`Missing image asset: src/assets/${path}`);
  return mod.default;
}
