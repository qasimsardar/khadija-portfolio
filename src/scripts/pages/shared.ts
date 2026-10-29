// Helpers shared by the case-study modules.
import gsap from 'gsap';
import type { MotionCtx } from '../motion';

/** Case-study hero: rises and scales slightly on scroll, drifts with the mouse on desktop. */
export function heroParallax(ctx: MotionCtx, opts: { depth?: number; tilt?: number } = {}) {
  const media = document.querySelector<HTMLElement>('[data-hero-media]');
  const frame = document.querySelector<HTMLElement>('[data-hero]');
  if (!media || !frame || ctx.reduced) return;
  const depth = opts.depth ?? 12;

  gsap.fromTo(media, { yPercent: 0 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: frame, start: 'top top', end: 'bottom top', scrub: true } });

  if (!ctx.fine) return;
  gsap.set(media, { scale: 1.06, transformPerspective: 1200 });
  const xTo = gsap.quickTo(media, 'x', { duration: 1.2, ease: 'power3.out' });
  const yTo = gsap.quickTo(media, 'y', { duration: 1.2, ease: 'power3.out' });
  const rxTo = opts.tilt ? gsap.quickTo(media, 'rotationX', { duration: 1.2, ease: 'power3.out' }) : null;
  const ryTo = opts.tilt ? gsap.quickTo(media, 'rotationY', { duration: 1.2, ease: 'power3.out' }) : null;
  const move = (e: PointerEvent) => {
    const r = frame.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    xTo(-nx * depth * 2);
    yTo(-ny * depth * 2);
    rxTo?.(ny * -(opts.tilt ?? 0));
    ryTo?.(nx * (opts.tilt ?? 0));
  };
  const leave = () => {
    xTo(0);
    yTo(0);
    rxTo?.(0);
    ryTo?.(0);
  };
  frame.addEventListener('pointermove', move);
  frame.addEventListener('pointerleave', leave);
  ctx.onCleanup(() => {
    frame.removeEventListener('pointermove', move);
    frame.removeEventListener('pointerleave', leave);
  });
}
