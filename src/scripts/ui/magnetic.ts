// Primary CTAs ([data-magnetic]) drift toward the cursor and settle back when it leaves.
import gsap from 'gsap';
import type { MotionCtx } from '../motion';

export function initMagnetic(ctx: MotionCtx) {
  if (!ctx.fine || ctx.reduced) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.32;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'expo.out', overwrite: 'auto' });
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    ctx.onCleanup(() => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    });
  });
}
