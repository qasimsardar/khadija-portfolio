// First-visit intro (once per session): name rises letter by letter through a mask, a counter runs 0-100,
// then the panel wipes up to reveal the page. About 1.8s in total.
import gsap from 'gsap';

export function runPreloader(reduced: boolean): Promise<void> {
  const root = document.documentElement;
  const el = document.querySelector<HTMLElement>('[data-preloader]');
  if (!el || reduced || root.classList.contains('skip-preloader')) return Promise.resolve();

  const done = () => {
    try {
      sessionStorage.setItem('ks-intro', '1');
    } catch {}
    root.classList.add('skip-preloader');
  };

  return new Promise((resolve) => {
    const counter = el.querySelector<HTMLElement>('[data-preloader-count]');
    const state = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        done();
        resolve();
      },
    });
    const chars = el.querySelectorAll('.preloader__char');
    // Take over the CSS translateY(110%) start state so GSAP doesn't stack a pixel offset on top of it.
    gsap.set(chars, { y: 0, yPercent: 110 });
    tl.to(chars, { yPercent: 0, duration: 0.8, ease: 'expo.out', stagger: 0.035 }, 0)
      .to(state, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: () => counter && (counter.textContent = String(Math.round(state.v))) }, 0)
      .to(chars, { yPercent: -110, duration: 0.6, ease: 'power3.in', stagger: 0.02 }, 1.1)
      .to(el, { yPercent: -100, duration: 0.75, ease: 'power3.inOut' }, 1.15)
      // Let the page's own intro start as the panel clears.
      .call(() => resolve(), [], 1.45);
  });
}
