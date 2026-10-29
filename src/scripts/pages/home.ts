// Home: typed role line, work section tone shifts, cover parallax, title character roll, scroll-reactive marquee.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { split as splitText } from '../split';
import type { MotionCtx } from '../motion';
import { DUR, EASE } from '../motion';

const PAPER = { bg: '#fefbf4', ink: '#141414', muted: '#4b4741' };

export default function home(ctx: MotionCtx) {
  const { reduced } = ctx;

  // Role line types itself in after the intro.
  const role = document.querySelector<HTMLElement>('[data-typed]');
  if (role && !reduced) {
    const split = splitText(role, { type: 'chars' });
    gsap.set(split.chars, { opacity: 0 });
    ctx.intro.then(() => gsap.to(split.chars, { opacity: 1, duration: 0.01, stagger: 0.035, delay: 0.5 }));
  }

  // Work: the page tone follows the project in view (backdrop colour + section ink).
  const work = document.querySelector<HTMLElement>('[data-work]');
  const backdrop = document.querySelector<HTMLElement>('[data-backdrop]');
  const cards = gsap.utils.toArray<HTMLElement>('[data-card]');
  if (work && backdrop && !reduced) {
    const setTone = (t: { bg: string; ink: string; muted: string }) => {
      gsap.to(backdrop, { backgroundColor: t.bg, duration: DUR.m, ease: EASE.inOut, overwrite: 'auto' });
      gsap.to(work, { '--work-ink': t.ink, '--work-muted': t.muted, duration: DUR.m, ease: EASE.inOut, overwrite: 'auto' });
    };
    cards.forEach((card, i) => {
      const tone = { bg: card.dataset.tone!, ink: card.dataset.ink!, muted: card.dataset.muted! };
      ScrollTrigger.create({
        trigger: card,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setTone(tone),
        onEnterBack: () => setTone(tone),
        onLeaveBack: () => i === 0 && setTone(PAPER),
        onLeave: () => i === cards.length - 1 && setTone(PAPER),
      });
    });
  }

  if (!reduced) {
    // Gentle parallax inside each cover frame.
    gsap.utils.toArray<HTMLElement>('[data-parallax-img]').forEach((img) => {
      gsap.fromTo(
        img,
        { yPercent: -6 },
        { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.closest('.frame') ?? img, start: 'top bottom', end: 'bottom top', scrub: true } },
      );
    });

    // Project titles roll character by character on hover.
    gsap.utils.toArray<HTMLElement>('[data-chars]').forEach((el) => {
      const split = splitText(el, { type: 'chars', mask: 'chars' });
      const roll = () =>
        gsap.fromTo(split.chars, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: EASE.out, stagger: 0.025, overwrite: true });
      const card = el.closest('[data-card]');
      card?.querySelectorAll('a').forEach((a) => a.addEventListener('mouseenter', roll));
      ctx.onCleanup(() => card?.querySelectorAll('a').forEach((a) => a.removeEventListener('mouseenter', roll)));
    });
  }

  // Marquee: infinite loop; pauses on hover, speed and direction follow scroll velocity.
  const marquee = document.querySelector<HTMLElement>('[data-marquee]');
  const track = marquee?.querySelector<HTMLElement>('[data-marquee-track]');
  const group = track?.querySelector<HTMLElement>('[data-marquee-group]');
  if (marquee && track && group && !reduced) {
    const loop = gsap.to(track, { x: () => -group.offsetWidth, duration: 38, ease: 'none', repeat: -1 });
    let hover = false;
    const base = { v: 1 };
    marquee.addEventListener('mouseenter', () => {
      hover = true;
      gsap.to(loop, { timeScale: 0, duration: 0.8, ease: EASE.soft });
    });
    marquee.addEventListener('mouseleave', () => {
      hover = false;
      gsap.to(loop, { timeScale: base.v, duration: 0.8, ease: EASE.soft });
    });
    ScrollTrigger.create({
      trigger: marquee,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate(self) {
        if (hover) return;
        const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 300);
        const dir = self.direction === -1 ? -1 : 1;
        base.v = dir;
        gsap.to(loop, { timeScale: dir * (1 + Math.abs(v)), duration: 0.3, overwrite: true });
        gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.3, ease: EASE.soft });
      },
    });
    // Start far into the repeats so reversed playback (scrolling up) never stalls at time 0.
    loop.totalTime(loop.duration() * 500);
  }
}
