// Prisma: hero mouse parallax, step-by-step problem chain, copyable swatches, autonomous prototype photo reel,
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

  // Move the prototype process gallery on its own while it is in view.
  const reel = document.querySelector<HTMLElement>('.proto');
  const viewport = reel?.querySelector<HTMLElement>('[data-proto-viewport]');
  const track = reel?.querySelector<HTMLElement>('[data-proto-track]');
  const toggle = reel?.querySelector<HTMLButtonElement>('[data-proto-toggle]');
  if (reel && viewport && track && !reduced) {
    let userPaused = false;
    let tween: gsap.core.Tween | undefined;
    const playIfAllowed = () => { if (!userPaused) tween?.play(); };
    const distance = () => track.scrollWidth / 2;
    tween = gsap.to(track, {
      x: () => -distance(),
      duration: () => gsap.utils.clamp(28, 60, distance() / 105),
      ease: 'none',
      repeat: -1,
      paused: true,
      scrollTrigger: {
        trigger: reel,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: playIfAllowed,
        onEnterBack: playIfAllowed,
        onLeave: () => tween?.pause(),
        onLeaveBack: () => tween?.pause(),
        invalidateOnRefresh: true,
      },
    });
    if (ScrollTrigger.isInViewport(reel)) tween.play();
    const onToggle = () => {
      userPaused = !userPaused;
      toggle?.setAttribute('aria-pressed', String(userPaused));
      if (toggle) toggle.textContent = userPaused ? 'Play motion' : 'Pause motion';
      if (userPaused) tween?.pause();
      else if (ScrollTrigger.isInViewport(reel)) tween?.play();
    };
    const onEnter = () => tween?.pause();
    const onLeave = () => { if (!userPaused && ScrollTrigger.isInViewport(reel)) tween?.play(); };
    toggle?.addEventListener('click', onToggle);
    viewport.addEventListener('pointerenter', onEnter);
    viewport.addEventListener('pointerleave', onLeave);
    viewport.addEventListener('focusin', onEnter);
    viewport.addEventListener('focusout', onLeave);
    ctx.onCleanup(() => {
      toggle?.removeEventListener('click', onToggle);
      viewport.removeEventListener('pointerenter', onEnter);
      viewport.removeEventListener('pointerleave', onLeave);
      viewport.removeEventListener('focusin', onEnter);
      viewport.removeEventListener('focusout', onLeave);
      tween?.scrollTrigger?.kill();
      tween?.kill();
    });
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
