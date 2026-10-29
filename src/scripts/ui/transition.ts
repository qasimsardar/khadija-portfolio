// Page transitions: a panel in the destination project's accent wipes up over the page, the new page swaps
// in underneath, then the panel continues off the top. Clicks on [data-morph] links skip the panel so the
// View Transition morph (thumbnail -> case-study hero, via matching transition:name) can play instead.
import gsap from 'gsap';
import { accentFor } from '../../data/projects';

export function initTransitions() {
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let morph = false;
  let covering = false;

  document.addEventListener(
    'click',
    (e) => {
      morph = !!(e.target as Element | null)?.closest?.('a[data-morph]');
    },
    true,
  );

  document.addEventListener('astro:before-preparation', (event) => {
    const e = event as Event & { to: URL; from: URL; loader: () => Promise<void> };
    // Same-page hash links are handled by Lenis.
    if (e.to.pathname === e.from.pathname) return;
    if (reduced() || morph) {
      morph = false;
      return;
    }
    const wipe = document.querySelector<HTMLElement>('[data-wipe]');
    if (!wipe) return;
    wipe.style.setProperty('--wipe', accentFor(e.to.pathname));
    const original = e.loader;
    e.loader = async () => {
      covering = true;
      // y: 0 clears the pixel offset GSAP would otherwise read from the CSS translateY(100%) start state.
      // The tween is wrapped in a plain Promise: a GSAP tween resolves with itself, which Promise.all would re-adopt forever.
      // A timer backs up onComplete so navigation never waits on animation frames (paused in background tabs).
      const cover = new Promise<void>((resolve) => {
        gsap.fromTo(wipe, { y: 0, yPercent: 100 }, { y: 0, yPercent: 0, duration: 0.75, ease: 'power3.inOut', overwrite: true, onComplete: resolve });
        setTimeout(resolve, 900);
      });
      await Promise.all([cover, original()]);
    };
  });

  document.addEventListener('astro:page-load', () => {
    if (!covering) return;
    covering = false;
    const wipe = document.querySelector<HTMLElement>('[data-wipe]');
    if (!wipe) return;
    gsap.to(wipe, {
      y: 0,
      yPercent: -100,
      duration: 0.85,
      ease: 'power3.inOut',
      delay: 0.08,
      overwrite: true,
      onComplete: () => void gsap.set(wipe, { y: 0, yPercent: 100 }),
    });
  });
}
