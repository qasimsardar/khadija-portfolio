// Work index: the hovered project's cover follows the cursor and cross-fades between rows (desktop only).
import gsap from 'gsap';
import type { MotionCtx } from '../motion';

export default function work(ctx: MotionCtx) {
  const index = document.querySelector<HTMLElement>('[data-index]');
  const preview = document.querySelector<HTMLElement>('[data-preview]');
  if (!index || !preview || !ctx.fine || ctx.reduced) return;

  const items = preview.querySelectorAll<HTMLElement>('[data-preview-item]');
  const xTo = gsap.quickTo(preview, 'x', { duration: 0.7, ease: 'power3.out' });
  const yTo = gsap.quickTo(preview, 'y', { duration: 0.7, ease: 'power3.out' });
  let active = -1;

  const show = (i: number) => {
    if (i === active) return;
    active = i;
    gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power3.out' });
    items.forEach((el, j) => gsap.to(el, { opacity: j === i ? 1 : 0, scale: j === i ? 1 : 1.08, duration: 0.6, ease: 'power3.out' }));
  };
  const hide = () => {
    active = -1;
    gsap.to(preview, { autoAlpha: 0, scale: 0.92, duration: 0.4, ease: 'power3.out' });
  };

  const move = (e: PointerEvent) => {
    xTo(e.clientX + 24);
    yTo(e.clientY - preview.offsetHeight / 2);
    const row = (e.target as Element).closest<HTMLElement>('[data-index-row]');
    if (row) show(Number(row.dataset.indexRow));
  };
  gsap.set(preview, { scale: 0.92 });
  index.addEventListener('pointermove', move);
  index.addEventListener('pointerleave', hide);
  ctx.onCleanup(() => {
    index.removeEventListener('pointermove', move);
    index.removeEventListener('pointerleave', hide);
  });
}
