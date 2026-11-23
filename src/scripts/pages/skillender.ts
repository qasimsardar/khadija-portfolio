// SkilLender: green stage with auto-scrolling screens, a tilted community browser,
// the How It Works loop, hover-scroll browsers, devices, showcase and cascade.
import gsap from 'gsap';
import type { MotionCtx } from '../motion';

// Each scrolling viewport needs to know how far its screenshot can travel.
function setDist(vp: HTMLElement) {
  const img = vp.querySelector('img');
  if (!img || !img.naturalWidth) return;
  const h = (vp.clientWidth * img.naturalHeight) / img.naturalWidth;
  vp.style.setProperty('--dist', `${-Math.max(0, h - vp.clientHeight)}px`);
}

export default function skillender(ctx: MotionCtx) {
  const vps = Array.from(document.querySelectorAll<HTMLElement>('.vp.auto, .vp.hover'));
  const measure = () => vps.forEach(setDist);
  vps.forEach((vp) => {
    const img = vp.querySelector('img');
    if (img && !img.complete) img.addEventListener('load', () => setDist(vp), { once: true });
  });
  measure();
  window.addEventListener('resize', measure);
  ctx.onCleanup(() => window.removeEventListener('resize', measure));

  if (ctx.reduced) return;

  // Hero stage: laptop rises, side browsers swing in, brand fades; then mouse parallax.
  const stage = document.querySelector<HTMLElement>('[data-sk-stage]');
  if (stage) {
    const lap = stage.querySelector<HTMLElement>('[data-sk-lap]');
    const bws = stage.querySelectorAll<HTMLElement>('[data-sk-bw]');
    const brand = stage.querySelector<HTMLElement>('[data-sk-brand]');
    gsap.set(bws, { rotationY: (i: number) => (i === 0 ? 26 : -26), rotationZ: (i: number) => (i === 0 ? -2 : 2) });
    const tl = gsap.timeline({ paused: true, delay: 0.2 });
    tl.from(stage, { clipPath: 'inset(8% 6% 8% 6% round 40px)', duration: 1.5, ease: 'expo.out' })
      .from(lap, { y: 160, rotationX: 22, opacity: 0, duration: 1.5, ease: 'expo.out' }, 0.15)
      .from(bws, { x: (i: number) => (i === 0 ? -180 : 180), rotationY: (i: number) => (i === 0 ? 55 : -55), opacity: 0, duration: 1.4, ease: 'expo.out', stagger: 0.08 }, 0.35)
      .from(brand, { y: -20, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.7);
    ctx.intro.then(() => tl.play());

    if (ctx.fine) {
      const layers = [lap, ...Array.from(bws)].filter(Boolean) as HTMLElement[];
      const movers = layers.map((el, i) => ({
        x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3.out' }),
        depth: i === 0 ? 10 : 22,
      }));
      const onMove = (e: MouseEvent) => {
        const r = stage.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        movers.forEach((m) => { m.x(px * m.depth); m.y(py * m.depth * 0.6); });
      };
      const onLeave = () => movers.forEach((m) => { m.x(0); m.y(0); });
      stage.addEventListener('mousemove', onMove);
      stage.addEventListener('mouseleave', onLeave);
      ctx.onCleanup(() => { stage.removeEventListener('mousemove', onMove); stage.removeEventListener('mouseleave', onLeave); });
    }
  }

  // Tilted community browser: idle float plus a scroll-linked untilt.
  const tilt = document.querySelector<HTMLElement>('[data-sk-tilt]');
  if (tilt) {
    const inner = tilt.querySelector<HTMLElement>('.browser');
    gsap.to(tilt, { y: -14, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    if (inner) gsap.fromTo(inner, { rotationY: -30, rotationX: 8, rotationZ: 4 }, { rotationY: -12, rotationX: 3, rotationZ: 1, ease: 'none', scrollTrigger: { trigger: tilt, start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  // How It Works: steps pop in one after another, icons spin up.
  const loop = document.querySelector<HTMLElement>('[data-sk-loop]');
  if (loop) {
    const steps = loop.querySelectorAll<HTMLElement>('.step');
    const tl = gsap.timeline({ scrollTrigger: { trigger: loop, start: 'top 82%' } });
    tl.from(steps, { y: 70, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.14 })
      .from(loop.querySelectorAll('.ico'), { scale: 0, rotation: -90, duration: 0.9, ease: 'back.out(2)', stagger: 0.14 }, 0.15);
  }

  // Mid-fi pages deal in with a fan.
  const pages = document.querySelector<HTMLElement>('[data-sk-pages]');
  if (pages) {
    const kids = pages.children;
    const n = kids.length;
    gsap.from(kids, { y: 120, opacity: 0, rotation: (i: number) => (i - (n - 1) / 2) * 5, duration: 1.3, ease: 'expo.out', stagger: 0.1, clearProps: 'transform', scrollTrigger: { trigger: pages, start: 'top 86%' } });
  }

  // Logo lockups pop.
  gsap.utils.toArray<HTMLElement>('[data-sk-logo]').forEach((logo) => {
    gsap.from(logo, { scale: 0.7, opacity: 0, rotation: -5, duration: 1.4, ease: 'elastic.out(1, 0.6)', scrollTrigger: { trigger: logo, start: 'top 88%' } });
  });

  const aa = document.querySelector<HTMLElement>('[data-sk-aa]');
  if (aa) gsap.from(aa, { scale: 0.5, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: aa, start: 'top 85%' } });

  // Devices: monitor and laptop slide together.
  const devices = document.querySelector<HTMLElement>('[data-sk-devices]');
  if (devices) {
    const [mon, lapt] = [devices.querySelector('.monitor'), devices.querySelector('.laptop')];
    const tl = gsap.timeline({ scrollTrigger: { trigger: devices, start: 'top 82%' } });
    tl.from(mon, { x: -120, opacity: 0, duration: 1.4, ease: 'expo.out' }).from(lapt, { x: 120, y: 40, opacity: 0, duration: 1.4, ease: 'expo.out' }, 0.12);
  }

  // Showcase: tilted tiles drift across as the section crosses the screen.
  const show = document.querySelector<HTMLElement>('[data-sk-showcase]');
  if (show) {
    const tiles = show.querySelectorAll<HTMLElement>('.tile');
    gsap.fromTo(tiles, { y: (i: number) => (i % 2 ? 90 : -40) }, { y: (i: number) => (i % 2 ? -60 : 70), ease: 'none', scrollTrigger: { trigger: show, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from(show, { clipPath: 'inset(10% 8% 10% 8% round 28px)', duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: show, start: 'top 80%' } });
  }

  // Cascade: browsers fan in from a stack.
  const cascade = document.querySelector<HTMLElement>('[data-sk-cascade]');
  if (cascade) {
    gsap.set(cascade.children, { rotationY: -24, rotationX: 8 });
    gsap.from(cascade.children, { x: (i: number) => -i * 120, y: (i: number) => -i * 80, opacity: 0, duration: 1.4, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: cascade, start: 'top 80%' } });
  }

  // Promo video: opens up from an inset card to full width.
  const video = document.querySelector<HTMLElement>('[data-sk-video]');
  if (video) {
    gsap.fromTo(video, { clipPath: 'inset(0% 8% 0% 8% round 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: video, start: 'top 90%', end: 'top 25%', scrub: true } });
  }
}
