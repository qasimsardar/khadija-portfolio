// Pennie: phones rise with depth and tilt toward the mouse, live wallet chart, tilting competitor cards,
// liquid palette fills, typed specimen, insights that check off one by one.
import gsap from 'gsap';
import { split as splitText } from '../split';
import type { MotionCtx } from '../motion';
import { DUR, EASE } from '../motion';
import { heroParallax } from './shared';

export default function pennie(ctx: MotionCtx) {
  const { reduced, fine } = ctx;
  heroParallax(ctx, { depth: 10, tilt: 5 });

  // Phones rise into view once the intro has played.
  const heroImg = document.querySelector<HTMLElement>('[data-hero-media] img');
  if (heroImg && !reduced) {
    gsap.set(heroImg, { yPercent: 8, opacity: 0 });
    ctx.intro.then(() => gsap.to(heroImg, { yPercent: 0, opacity: 1, duration: 1.6, ease: EASE.out, delay: 0.2 }));
  }

  // Wallet chart: bars grow from the axis while the balance counts up (count is a shared [data-count]).
  const wallet = document.querySelector<HTMLElement>('[data-wallet]');
  if (wallet && !reduced) {
    const bars = wallet.querySelectorAll('[data-bar]');
    gsap.fromTo(
      bars,
      { scaleY: 0 },
      { scaleY: 1, duration: 1.4, ease: EASE.out, stagger: 0.06, scrollTrigger: { trigger: wallet, start: 'top 70%', toggleActions: 'play none none none' } },
    );
  }

  // Competitor cards tilt toward the pointer.
  if (fine && !reduced) {
    document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
      const rx = gsap.quickTo(card, 'rotationX', { duration: 0.8, ease: 'power3.out' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: 0.8, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        rx(((e.clientY - r.top) / r.height - 0.5) * -10);
        ry(((e.clientX - r.left) / r.width - 0.5) * 12);
      };
      const leave = () => {
        rx(0);
        ry(0);
      };
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', leave);
      ctx.onCleanup(() => {
        card.removeEventListener('pointermove', move);
        card.removeEventListener('pointerleave', leave);
      });
    });
  }

  // Palette: each chip fills with a liquid wipe, one after another.
  const palette = document.querySelector<HTMLElement>('[data-palette]');
  if (palette && !reduced) {
    const fills = palette.querySelectorAll('[data-fill]');
    gsap.fromTo(
      fills,
      { yPercent: 105, rotation: -4 },
      { yPercent: 0, rotation: 0, duration: 1.6, ease: 'power3.out', stagger: 0.16, scrollTrigger: { trigger: palette, start: 'top 80%', toggleActions: 'play none none none' } },
    );
  }

  // Typography: "Aa1" scales in and the alphabet types itself out.
  const spec = document.querySelector<HTMLElement>('[data-specimen]');
  if (spec && !reduced) {
    const aa1 = spec.querySelector('[data-aa1]');
    const glyphs = spec.querySelector<HTMLElement>('[data-glyphs]');
    const tl = gsap.timeline({ scrollTrigger: { trigger: spec, start: 'top 75%', toggleActions: 'play none none none' } });
    if (aa1) tl.from(aa1, { scale: 0.6, opacity: 0, duration: DUR.l + 0.3, ease: EASE.out, transformOrigin: '70% 60%' }, 0);
    if (glyphs) {
      const split = splitText(glyphs, { type: 'chars' });
      tl.from(split.chars, { opacity: 0, duration: 0.01, stagger: 0.022 }, 0.2);
    }
  }

  // Final insights check off one by one.
  const checks = document.querySelector<HTMLElement>('[data-checks]');
  if (checks) {
    const items = checks.querySelectorAll('li');
    const ticks = checks.querySelectorAll<SVGPathElement>('[data-check]');
    if (reduced) {
      gsap.from(items, { opacity: 0, duration: DUR.s, stagger: 0.1, scrollTrigger: { trigger: checks, start: 'top 85%', toggleActions: 'play none none none' } });
    } else {
      ticks.forEach((t) => t.setAttribute('pathLength', '1'));
      gsap.set(ticks, { strokeDasharray: 1, strokeDashoffset: 1 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: checks, start: 'top 80%', toggleActions: 'play none none none' } });
      items.forEach((li, i) => {
        tl.from(li, { opacity: 0, x: -16, duration: DUR.m, ease: EASE.out }, i * 0.45);
        tl.to(ticks[i], { strokeDashoffset: 0, duration: 0.5, ease: EASE.inOut }, i * 0.45 + 0.25);
      });
    }
  }
}
