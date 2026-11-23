// GoSafe: hero render rises into place, phones float in 3D, hi-fi rows deal in, showcase drifts on scroll.
import gsap from 'gsap';
import type { MotionCtx } from '../motion';

export default function gosafe(ctx: MotionCtx) {
  if (ctx.reduced) return;

  // Hero render: rises, un-tilts and sharpens after the intro, then follows the mouse.
  const hero = document.querySelector<HTMLElement>('[data-gs-hero]');
  if (hero) {
    gsap.set(hero, { transformPerspective: 1400 });
    const tw = gsap.fromTo(
      hero,
      { y: 120, rotationX: 18, scale: 0.88, opacity: 0, filter: 'blur(12px)' },
      { y: 0, rotationX: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.6, ease: 'expo.out', paused: true, delay: 0.25 },
    );
    ctx.intro.then(() => tw.play());
  }

  // The single tilted phone next to Problem / Solution: idle float plus a scroll-linked turn.
  const tilt = document.querySelector<HTMLElement>('[data-gs-tilt]');
  if (tilt) {
    gsap.set(tilt, { rotationX: 6 });
    gsap.to(tilt, { y: -18, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.fromTo(tilt, { rotationY: -40, rotationZ: 14 }, { rotationY: -10, rotationZ: 2, ease: 'none', scrollTrigger: { trigger: tilt.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  // Logo: the arrow mark pops in.
  const logo = document.querySelector<HTMLElement>('[data-gs-logo]');
  if (logo) gsap.from(logo, { scale: 0.6, opacity: 0, rotation: -6, duration: 1.4, ease: 'elastic.out(1, 0.6)', scrollTrigger: { trigger: logo, start: 'top 85%' } });

  // Aa1 grows in letter by letter.
  const aa = document.querySelector<HTMLElement>('[data-gs-aa]');
  if (aa) gsap.from(aa, { scale: 0.5, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: aa, start: 'top 85%' } });

  // Hi-fi rows: phones deal in from below with a slight fan.
  gsap.utils.toArray<HTMLElement>('[data-gs-row]').forEach((row) => {
    const phones = row.children;
    const n = phones.length;
    gsap.from(phones, {
      y: 140,
      opacity: 0,
      rotation: (i: number) => (i - (n - 1) / 2) * 6,
      duration: 1.3,
      ease: 'expo.out',
      stagger: 0.09,
      clearProps: 'transform',
      scrollTrigger: { trigger: row, start: 'top 88%' },
    });
  });

  // Showcase: zooms out and slides as it crosses the screen.
  const show = document.querySelector<HTMLElement>('[data-gs-showcase]');
  if (show) {
    const media = show.querySelector('.showcase-media');
    gsap.fromTo(media, { scale: 1.25, xPercent: 4 }, { scale: 1, xPercent: -2, ease: 'none', scrollTrigger: { trigger: show, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from(show, { clipPath: 'inset(12% 10% 12% 10% round 28px)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: show, start: 'top 80%' } });
  }

  // Closing render: two phones fly in, then float out of sync.
  const duo = document.querySelector<HTMLElement>('[data-gs-duo]');
  if (duo) {
    const back = duo.querySelector('.duo-back');
    const front = duo.querySelector('.duo-front');
    gsap.set(back, { rotationY: -18, rotationX: 8, rotationZ: 12 });
    gsap.set(front, { rotationY: 18, rotationX: 10, rotationZ: -30 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: duo, start: 'top 80%' } });
    tl.from(back, { x: 160, y: -60, opacity: 0, duration: 1.5, ease: 'expo.out' }).from(front, { x: -160, y: 80, opacity: 0, duration: 1.5, ease: 'expo.out' }, 0.15);
    gsap.to(back, { y: '-=16', duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5 });
    gsap.to(front, { y: '+=16', duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.5 });
  }
}
