// Single motion entry point: smooth scroll, shared reveal primitives and per-page modules.
// Re-initialised on every `astro:page-load` and torn down on `astro:before-swap`.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
import { initCursor } from './ui/cursor';
import { initMagnetic } from './ui/magnetic';
import { initNav } from './ui/nav';
import { initTransitions } from './ui/transition';
import { runPreloader } from './ui/preloader';
import home from './pages/home';
import work from './pages/work';
import prisma from './pages/prisma';
import tiffin from './pages/tiffin';
import pennie from './pages/pennie';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const EASE = { out: 'expo.out', inOut: 'power3.inOut', soft: 'power2.out' } as const;
export const DUR = { s: 0.6, m: 0.9, l: 1.2 } as const;

export interface MotionCtx {
  lenis: Lenis | null;
  reduced: boolean;
  /** Desktop-class pointer (mouse/trackpad). */
  fine: boolean;
  /** Resolves when the first-visit preloader has finished (immediately on later pages). */
  intro: Promise<void>;
  onCleanup(fn: () => void): void;
}

type PageModule = (ctx: MotionCtx) => void;
const pages: Record<string, PageModule> = { home, work, prisma, tiffin, pennie };

declare global {
  interface Window {
    __ksMotion?: boolean;
  }
}

let lenis: Lenis | null = null;
let gctx: gsap.Context | null = null;
let tick: ((time: number) => void) | null = null;
const cleanups: (() => void)[] = [];
let firstLoad = true;

function startLenis() {
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    smoothWheel: true,
    anchors: { offset: -72, duration: 1.4 },
    stopInertiaOnNavigate: true,
  });
  lenis.on('scroll', ScrollTrigger.update);
  tick = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
}

function stopLenis() {
  if (tick) gsap.ticker.remove(tick);
  tick = null;
  lenis?.destroy();
  lenis = null;
}

/** Shared, attribute-driven reveals used on every page. */
function primitives(ctx: MotionCtx) {
  const { reduced } = ctx;
  const enter = (el: Element, start = 'top 88%') => ({ trigger: el, start, toggleActions: 'play none none none' });

  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    if (reduced) return void gsap.to(el, { opacity: 1, duration: DUR.s, scrollTrigger: enter(el) });
    if (el.dataset.reveal === 'clip') {
      const img = el.querySelector('img, video');
      const tl = gsap.timeline({ scrollTrigger: enter(el, 'top 85%') });
      tl.to(el, { clipPath: 'inset(0% 0 0 0)', duration: DUR.l + 0.2, ease: EASE.inOut });
      if (img) tl.fromTo(img, { scale: 1.15 }, { scale: 1, duration: DUR.l + 0.6, ease: EASE.out }, 0);
      return;
    }
    gsap.to(el, { opacity: 1, y: 0, duration: DUR.l, ease: EASE.out, scrollTrigger: enter(el) });
  });

  gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((el) => {
    const items = el.children;
    gsap.to(items, {
      opacity: 1,
      y: reduced ? undefined : 0,
      duration: reduced ? DUR.s : DUR.l,
      ease: EASE.out,
      stagger: reduced ? 0 : Number(el.dataset.stagger) || 0.08,
      scrollTrigger: enter(el),
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
    if (reduced) return void gsap.to(el, { opacity: 1, duration: DUR.s, scrollTrigger: enter(el) });
    // "intro" blocks play once the preloader has finished; others play as they scroll in.
    const intro = el.dataset.split === 'intro';
    let played = false;
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit(self) {
        gsap.set(el, { opacity: 1 });
        // A re-split (resize, font swap) after the reveal just keeps the lines in place.
        if (played) return gsap.set(self.lines, { yPercent: 0 });
        const from = { yPercent: 110 };
        const to = { yPercent: 0, duration: DUR.l, ease: EASE.out, stagger: 0.09, onComplete: () => (played = true) };
        if (intro) {
          const tw = gsap.fromTo(self.lines, from, { ...to, paused: true });
          ctx.intro.then(() => tw.play());
          return tw;
        }
        return gsap.fromTo(self.lines, from, { ...to, scrollTrigger: enter(el) });
      },
    });
  });

  // Words fade from 15% to 100% as the block scrolls through the viewport.
  gsap.utils.toArray<HTMLElement>('[data-words]').forEach((el) => {
    if (reduced) return;
    SplitText.create(el, {
      type: 'words',
      autoSplit: true,
      onSplit(self) {
        return gsap.fromTo(
          self.words,
          { opacity: 0.15 },
          { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } },
        );
      },
    });
  });

  if (!reduced) {
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      const amount = Number(el.dataset.parallax) || 0.12;
      gsap.fromTo(
        el,
        { yPercent: -amount * 100 },
        { yPercent: amount * 100, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    });
  }

  // Number count-up: data-count="9999.99" data-decimals="2" data-prefix="$"
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const prefix = el.dataset.prefix || '';
    if (reduced) return;
    const state = { v: 0 };
    el.textContent = prefix + (0).toFixed(decimals);
    gsap.to(state, {
      v: end,
      duration: Number(el.dataset.duration) || 1.6,
      ease: EASE.out,
      scrollTrigger: enter(el, 'top 85%'),
      onUpdate: () => (el.textContent = prefix + state.v.toFixed(decimals)),
    });
  });

  // Large videos load only when they approach the viewport, and pause off-screen.
  const videos = document.querySelectorAll<HTMLVideoElement>('video[data-src]');
  if (videos.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) {
            if (!v.src) v.src = v.dataset.src!;
            if (reduced) v.controls = true;
            else v.play().catch(() => (v.controls = true));
          } else if (v.src) v.pause();
        }
      },
      { rootMargin: '300px 0px' },
    );
    videos.forEach((v) => io.observe(v));
    ctx.onCleanup(() => io.disconnect());
  }

  // Case-study reading progress.
  const bar = document.querySelector<HTMLElement>('[data-progress]');
  if (bar && document.body.hasAttribute('data-progress-page')) {
    gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
  }
}

let introPromise: Promise<void> = Promise.resolve();

async function init() {
  window.__ksMotion = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!reduced) startLenis();
  if (firstLoad) {
    lenis?.stop();
    introPromise = runPreloader(reduced).then(() => lenis?.start());
    firstLoad = false;
  } else {
    introPromise = Promise.resolve();
  }

  const ctx: MotionCtx = { lenis, reduced, fine, intro: introPromise, onCleanup: (fn) => cleanups.push(fn) };
  // Line splitting needs final font metrics.
  await document.fonts.ready;

  gctx = gsap.context(() => {
    primitives(ctx);
    initNav(ctx);
    initMagnetic(ctx);
    const page = document.documentElement.dataset.page || '';
    pages[page]?.(ctx);
  });

  // Land hash links (e.g. /#about) precisely now that layout and fonts are final.
  if (location.hash.length > 1) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) {
      if (lenis) lenis.scrollTo(target, { offset: -72, immediate: true, force: true });
      else window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - 72 });
    }
  }
  ScrollTrigger.refresh();
}

function destroy() {
  cleanups.splice(0).forEach((fn) => fn());
  gctx?.revert();
  gctx = null;
  ScrollTrigger.getAll().forEach((t) => t.kill());
  stopLenis();
}

initCursor();
initTransitions();
document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', destroy);
