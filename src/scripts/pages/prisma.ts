// Prisma: hero mouse parallax, step-by-step problem chain, research circles converging, copyable swatches, autonomous
// prototype photo reel, the app design band (phones dealing in, annotated home screen, sticky feature walkthrough,
// live UI kit, drifting screen wall) and the product film opening to full bleed.
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

  // Key insights: the three research circles slide together into their overlap; need icons pop in after.
  const venn = document.querySelector<HTMLElement>('[data-pr-venn]');
  if (venn && !reduced) {
    const circles = venn.children;
    gsap.from(circles, {
      x: (i: number) => (i - 1) * 140,
      scale: 0.7,
      opacity: 0,
      duration: 1.4,
      ease: EASE.out,
      stagger: 0.08,
      scrollTrigger: { trigger: venn, start: 'top 82%' },
    });
  }
  const needs = document.querySelector<HTMLElement>('[data-pr-needs]');
  if (needs && !reduced) {
    const tl = gsap.timeline({ scrollTrigger: { trigger: needs, start: 'top 85%' } });
    tl.from(needs.querySelectorAll('img'), { scale: 0, rotation: -20, duration: 0.9, ease: 'back.out(2.4)', stagger: 0.08 }).from(
      needs.querySelectorAll('span'),
      { opacity: 0, y: 14, duration: DUR.s, ease: EASE.out, stagger: 0.08 },
      0.2,
    );
  }

  // Logo mark pops in, like the GoSafe logo.
  const logo = document.querySelector<HTMLElement>('[data-pr-logo]');
  if (logo && !reduced) gsap.from(logo, { scale: 0.6, opacity: 0, rotation: -6, duration: 1.4, ease: 'elastic.out(1, 0.6)', scrollTrigger: { trigger: logo, start: 'top 85%' } });

  // Exploded view gently pulls apart (scales) as it crosses the screen.
  const explode = document.querySelector<HTMLElement>('[data-pr-explode]');
  if (explode && !reduced) {
    const img = explode.querySelector('img');
    gsap.fromTo(img, { scale: 0.9 }, { scale: 1.06, ease: 'none', scrollTrigger: { trigger: explode, start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  // ---- App design band -------------------------------------------------------------------------------------------

  // Hero mockup rises and un-tilts in 3D.
  const appHero = document.querySelector<HTMLElement>('[data-pr-apphero]');
  if (appHero && !reduced) {
    const inner = appHero.firstElementChild as HTMLElement;
    gsap.set(appHero, { perspective: 1400 });
    gsap.from(inner, { y: 120, rotationX: 22, scale: 0.9, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: appHero, start: 'top 85%' } });
  }

  // Draws connector arrows once their group arrives.
  const drawArrows = (root: Element, tl: gsap.core.Timeline, at: number) => {
    const arrows = root.querySelectorAll<SVGPathElement>('[data-pr-arrow]');
    arrows.forEach((a) => a.setAttribute('pathLength', '1'));
    gsap.set(arrows, { strokeDasharray: 1, strokeDashoffset: 1 });
    tl.to(arrows, { strokeDashoffset: 0, duration: 0.6, ease: EASE.inOut, stagger: 0.18 }, at);
  };

  // Onboarding: phones deal in from below with a slight fan, then the arrows draw between them.
  const flow = document.querySelector<HTMLElement>('[data-pr-flow]');
  if (flow && !reduced) {
    const phones = flow.querySelectorAll('[data-pr-phone]');
    const n = phones.length;
    const tl = gsap.timeline({ scrollTrigger: { trigger: flow, start: 'top 85%' } });
    tl.from(phones, { y: 140, opacity: 0, rotation: (i: number) => (i - (n - 1) / 2) * 6, duration: 1.3, ease: 'expo.out', stagger: 0.1, clearProps: 'transform' });
    tl.from(flow.querySelectorAll('.step-label'), { opacity: 0, y: 12, duration: DUR.s, ease: EASE.out, stagger: 0.1 }, 0.4);
    drawArrows(flow, tl, 0.7);
  }

  // Annotated home screen: the phone settles, then each callout line draws out from the screen.
  const anatomy = document.querySelector<HTMLElement>('[data-pr-anatomy]');
  if (anatomy && !reduced) {
    const device = anatomy.querySelector('.device');
    const callouts = anatomy.querySelectorAll<HTMLElement>('[data-pr-callout]');
    const tl = gsap.timeline({ scrollTrigger: { trigger: anatomy, start: 'top 75%' } });
    tl.from(device, { y: 80, opacity: 0, scale: 0.92, duration: 1.3, ease: EASE.out });
    callouts.forEach((c, i) => {
      const at = 0.5 + i * 0.16;
      tl.from(c.querySelector('.callout-dot'), { scale: 0, duration: 0.5, ease: 'back.out(3)' }, at)
        .from(c.querySelector('.callout-line'), { scaleX: 0, duration: 0.6, ease: EASE.inOut }, at + 0.1)
        .from(c.querySelector('.callout-text'), { opacity: 0, x: c.classList.contains('left') ? 20 : -20, duration: 0.7, ease: EASE.out }, at + 0.35);
    });
  }

  // Feature walkthrough: the sticky phone shows the screen of whichever feature text is centred (works without motion too).
  const walk = document.querySelector<HTMLElement>('[data-pr-walk]');
  if (walk) {
    const items = walk.querySelectorAll<HTMLElement>('[data-pr-feature]');
    const screens = walk.querySelectorAll<HTMLElement>('[data-pr-screen]');
    const dots = walk.querySelectorAll<HTMLElement>('[data-pr-dot]');
    const ring = walk.querySelector<HTMLElement>('[data-pr-ring]');
    const activate = (i: number) => {
      items.forEach((el, j) => el.classList.toggle('is-active', i === j));
      screens.forEach((el, j) => el.classList.toggle('is-active', i === j));
      dots.forEach((el, j) => el.classList.toggle('is-active', i === j));
      const c = items[i]?.style.getPropertyValue('--c');
      if (ring && c) ring.style.setProperty('--ring', c);
    };
    items.forEach((item, i) => {
      ScrollTrigger.create({ trigger: item, start: 'top center', end: 'bottom center', onToggle: (self) => self.isActive && activate(i) });
    });
    activate(0);
    const device = walk.querySelector('.walk-device');
    if (device && !reduced) {
      gsap.set(walk.querySelector('.walk-sticky'), { perspective: 1200 });
      gsap.fromTo(device, { rotationY: -16, rotationX: 6 }, { rotationY: 16, rotationX: -4, ease: 'none', scrollTrigger: { trigger: walk, start: 'top center', end: 'bottom center', scrub: true } });
    }
  }

  // Product film: pause/play and sound toggles (it autoplays muted, so sound needs a tap).
  const film = document.querySelector<HTMLVideoElement>('.film video');
  const filmPlay = document.querySelector<HTMLButtonElement>('[data-pr-film-play]');
  const filmSound = document.querySelector<HTMLButtonElement>('[data-pr-film-sound]');
  if (film && filmPlay && filmSound) {
    const label = (b: HTMLButtonElement, t: string) => (b.querySelector('[data-label]')!.textContent = t);
    const sync = () => {
      filmPlay.setAttribute('aria-pressed', String(film.paused));
      label(filmPlay, film.paused ? 'Play video' : 'Pause video');
      filmSound.setAttribute('aria-pressed', String(!film.muted));
      label(filmSound, film.muted ? 'Sound on' : 'Sound off');
    };
    const ensureSrc = () => {
      if (!film.src && film.dataset.src) film.src = film.dataset.src;
    };
    const togglePlay = () => {
      ensureSrc();
      if (film.paused) film.play().catch(() => (film.controls = true));
      else film.pause();
    };
    const toggleSound = () => {
      ensureSrc();
      film.muted = !film.muted;
      if (!film.muted) {
        if (film.paused) film.play().catch(() => (film.controls = true));
      }
    };
    filmPlay.addEventListener('click', togglePlay);
    filmSound.addEventListener('click', toggleSound);
    const evs = ['play', 'pause', 'volumechange'] as const;
    evs.forEach((e) => film.addEventListener(e, sync));
    sync();
    ctx.onCleanup(() => {
      filmPlay.removeEventListener('click', togglePlay);
      filmSound.removeEventListener('click', toggleSound);
      evs.forEach((e) => film.removeEventListener(e, sync));
    });
  }

  // Flow pairs: first phone lands, the arrow draws, the second phone follows.
  if (!reduced) {
    gsap.utils.toArray<HTMLElement>('[data-pr-pair]').forEach((pair) => {
      const [a, b] = pair.querySelectorAll('[data-pr-phone]');
      const tl = gsap.timeline({ scrollTrigger: { trigger: pair, start: 'top 80%' } });
      tl.from(a, { y: 100, rotation: -8, opacity: 0, duration: 1.2, ease: EASE.out });
      drawArrows(pair, tl, 0.45);
      tl.from(b, { y: 100, rotation: 8, opacity: 0, duration: 1.2, ease: EASE.out }, 0.7);
      tl.from(pair.querySelectorAll('.pair-title, .copy'), { opacity: 0, y: 16, duration: DUR.m, ease: EASE.out, stagger: 0.1 }, 0.9);
    });
  }

  // UI kit: cards rise in, the toggle switches on, the hue thumb glides along its track.
  const kit = document.querySelector<HTMLElement>('[data-pr-kit]');
  if (kit && !reduced) {
    const toggle = kit.querySelector<HTMLElement>('[data-pr-toggle]');
    const thumb = kit.querySelector<HTMLElement>('[data-pr-thumb]');
    const tl = gsap.timeline({ scrollTrigger: { trigger: kit, start: 'top 80%' } });
    tl.from(kit.children, { y: 70, opacity: 0, duration: 1.2, ease: EASE.out, stagger: 0.12, clearProps: 'transform,opacity' });
    tl.call(() => toggle?.classList.add('is-on'), undefined, 0.9);
    if (thumb) {
      const glide = gsap.fromTo(thumb, { left: '18%' }, { left: '78%', duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true });
      ScrollTrigger.create({ trigger: kit, start: 'top bottom', end: 'bottom top', onToggle: (self) => (self.isActive ? glide.play() : glide.pause()) });
    }
  }

  // Screen wall: alternate columns drift up and down against each other as the band scrolls past.
  const wall = document.querySelector<HTMLElement>('[data-pr-wall]');
  if (wall && !reduced) {
    gsap.utils.toArray<HTMLElement>('[data-pr-col]', wall).forEach((col) => {
      const up = col.dataset.prCol === 'up';
      gsap.fromTo(col, { yPercent: up ? 8 : -14 }, { yPercent: up ? -14 : 8, ease: 'none', scrollTrigger: { trigger: wall, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    gsap.from(wall.querySelector('.wall-tilt'), { scale: 1.2, opacity: 0, duration: 1.6, ease: EASE.out, scrollTrigger: { trigger: wall, start: 'top 85%' } });
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
