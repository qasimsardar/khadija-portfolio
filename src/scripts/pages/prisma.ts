// Prisma: hero mouse parallax, step-by-step problem chain, copyable swatches, pinned horizontal proto gallery,
// and the product film opening to full bleed.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { MotionCtx } from '../motion';
import { DUR, EASE } from '../motion';
import { heroParallax } from './shared';

export default function prisma(ctx: MotionCtx) {
  const { reduced } = ctx;
  heroParallax(ctx);

  // 1 -> 2 -> 3: each step rises in, then the arrow to the next one draws.
  const chain = document.querySelector<HTMLElement>('[data-chain]');
  if (chain && !reduced) {
    const steps = chain.querySelectorAll<HTMLElement>('[data-chain-step]');
    const arrows = chain.querySelectorAll<SVGPathElement>('[data-chain-arrow]');
    arrows.forEach((a) => a.setAttribute('pathLength', '1'));
    gsap.set(arrows, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(steps, { opacity: 0, y: 30 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: chain, start: 'top 80%', toggleActions: 'play none none none' } });
    steps.forEach((s, i) => {
      tl.to(s, { opacity: 1, y: 0, duration: DUR.m, ease: EASE.out }, i * 0.55);
      if (arrows[i]) tl.to(arrows[i], { strokeDashoffset: 0, duration: 0.5, ease: EASE.inOut }, i * 0.55 + 0.35);
    });
  }

  // Swatches ripple in; click or Enter copies the hex code.
  const swatches = document.querySelector<HTMLElement>('[data-swatches]');
  const toast = document.querySelector<HTMLElement>('[data-toast]');
  if (swatches) {
    const dots = swatches.querySelectorAll('.dot');
    if (!reduced) {
      gsap.fromTo(
        dots,
        { scale: 0 },
        { scale: 1, duration: DUR.l, ease: 'expo.out', stagger: 0.09, scrollTrigger: { trigger: swatches, start: 'top 85%', toggleActions: 'play none none none' } },
      );
    }
    let timer = 0;
    const copy = async (e: Event) => {
      const btn = (e.target as Element).closest<HTMLButtonElement>('[data-hex]');
      if (!btn) return;
      const hex = btn.dataset.hex!;
      try {
        await navigator.clipboard.writeText(hex);
        if (toast) toast.textContent = `Copied ${hex}`;
      } catch {
        if (toast) toast.textContent = hex;
      }
      toast?.classList.add('is-on');
      clearTimeout(timer);
      timer = window.setTimeout(() => toast?.classList.remove('is-on'), 1600);
    };
    swatches.addEventListener('click', copy);
    ctx.onCleanup(() => {
      swatches.removeEventListener('click', copy);
      clearTimeout(timer);
    });
  }

  // Proto: pin the section and scrub the photo track sideways (desktop only).
  const hs = document.querySelector<HTMLElement>('[data-hscroll]');
  const track = hs?.querySelector<HTMLElement>('[data-hscroll-track]');
  if (hs && track && !reduced) {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      hs.classList.add('hscroll-on');
      const distance = () => track.scrollWidth - window.innerWidth + parseFloat(getComputedStyle(track.parentElement!).paddingLeft) * 2;
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: { trigger: hs, start: 'top top+=40', end: () => `+=${distance()}`, scrub: 0.6, pin: true, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      return () => hs.classList.remove('hscroll-on');
    });
    ctx.onCleanup(() => mm.revert());
  }

  // Film: inset frame opens to full bleed.
  const frame = document.querySelector<HTMLElement>('[data-expand-frame]');
  if (frame && !reduced) {
    gsap.fromTo(
      frame,
      { clipPath: 'inset(0% 8% 0% 8% round 28px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top 90%', end: 'center center', scrub: true },
      },
    );
  }

  ScrollTrigger.refresh();
}
