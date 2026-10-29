import type { ImageMetadata } from 'astro';

// Every exported design image, keyed by its path under src/assets (e.g. "prisma/hero.jpg").
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{jpg,png}', {
  eager: true,
});

/**
 * Looks up an exported image. The extension is optional and interchangeable: images with real
 * transparency are stored as PNG and the rest as JPG, so "prisma/logo.jpg" also finds "prisma/logo.png".
 */
export function asset(path: string): ImageMetadata {
  const stem = path.replace(/\.(jpg|png)$/, '');
  const mod = files[`/src/assets/${stem}.jpg`] ?? files[`/src/assets/${stem}.png`];
  if (!mod) throw new Error(`Missing image asset: src/assets/${path}`);
  return mod.default;
}
