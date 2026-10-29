// The five projects. Copy is hers (from the Figma file); colours come from each project's own palette.
export interface Project {
  slug: string;
  name: string;
  /** Name as it appears highlighted at the start of the description. */
  mark: string;
  category: 'Industrial Design' | 'UX Design';
  description: string;
  /** Case study URL; projects without one get a locked "coming soon" teaser. */
  href?: string;
  /** Accent used by the cursor, page wipe and highlights. */
  accent: string;
  /** Page tone the home backdrop tweens to while this project is in view, plus readable ink on it. */
  tone: { bg: string; ink: string; muted: string };
  cover: { src: string; alt: string };
  hero?: { src: string; alt: string };
  band: { src: string; alt: string; bg: string; marker: string; dark: boolean };
  /** Case study meta strip. Empty fields are hidden. */
  meta: { role?: string; year?: string; type: string; tools?: string[]; scope: string[] };
}

export const projects: Project[] = [
  {
    slug: 'prisma',
    name: 'Prisma',
    mark: 'PRISMA',
    category: 'Industrial Design',
    description:
      'is a portable, multifunctional speaker designed for fitness and dance instructors, combining powerful sound, customizable RGB lighting, and hands-free voice amplification.',
    href: '/prisma',
    accent: '#dd1886',
    tone: { bg: '#0b0b10', ink: '#f4f1ea', muted: 'rgba(244,241,234,0.7)' },
    cover: { src: 'home/prisma.jpg', alt: 'Two Prisma speakers with glowing RGB light edges on a black background' },
    hero: { src: 'prisma/hero.jpg', alt: 'Two Prisma speakers with RGB-lit edges in front of large glowing PRISMA lettering' },
    band: { src: 'work/prisma.jpg', alt: 'Two Prisma speakers with glowing RGB light edges', bg: '#000', marker: '#fce5d6', dark: true },
    meta: {
      type: 'Industrial Design',
      scope: ['User Research', 'Ideation', 'Branding', 'CAD', 'Prototyping', 'Packaging', 'App Design'],
    },
  },
  {
    slug: 'tiffin',
    name: 'Tiffin',
    mark: 'TIFFIN',
    category: 'Industrial Design',
    description:
      'is a modern commuter food carrier inspired by Lahore’s rich food culture, celebrating the tradition of sharing homemade meals, eating together, and connecting with others through food.',
    href: '/tiffin',
    accent: '#e96b4d',
    // Light text on a deep coral: dark text can't reach 4.5:1 on mid-tone coral.
    tone: { bg: '#ad4f38', ink: '#fff8f3', muted: '#fff8f3' },
    cover: { src: 'home/tiffin.jpg', alt: 'Coral Tiffin lunchbox open to show rice and four steel containers' },
    hero: { src: 'tiffin/hero.jpg', alt: 'Coral SAATH tiffin lunchbox open with rice and four containers, beside the SAATH and tiffin logos' },
    band: { src: 'work/tiffin.jpg', alt: 'Coral Tiffin lunchbox with its lid lifted', bg: '#fafbfd', marker: '#9c4747', dark: false },
    meta: {
      type: 'Industrial Design',
      scope: ['Regional Research', 'Moodboard', 'Ideation', 'Branding', 'CAD', 'Manufacturing', 'Packaging', 'Merchandising'],
    },
  },
  {
    slug: 'pennie',
    name: 'Pennie',
    mark: 'Pennie',
    category: 'UX Design',
    description:
      'is a smart, user-friendly app designed to make budgeting, saving, and tracking expenses easier; especially for people juggling careers, family, and unpredictable incomes.',
    href: '/pennie',
    accent: '#d5ee74',
    tone: { bg: '#232323', ink: '#f4f4f0', muted: 'rgba(244,244,240,0.72)' },
    cover: { src: 'home/pennie.jpg', alt: 'Two phones showing the Pennie budgeting app home screen' },
    hero: { src: 'pennie/hero.jpg', alt: 'Two phones showing the Pennie app home screen with wallet balance and spending chart' },
    band: { src: 'work/pennie.jpg', alt: 'Two phones showing the Pennie budgeting app', bg: '#2c2c2c', marker: '#d5ee74', dark: true },
    meta: {
      type: 'UX Design',
      scope: ['Competitive Analysis', 'User Flow', 'Branding', 'UI Kit', 'Low & High Fidelity Prototypes', 'Usability Studies'],
    },
  },
  {
    slug: 'skillender',
    name: 'SkilLender',
    mark: 'SkilLender',
    category: 'UX Design',
    description:
      'connects skilled artisans and professionals with underserved learners through hands-on workshops, empowering them with practical skills to achieve financial independence.',
    accent: '#14ad7d',
    tone: { bg: '#cbf3ed', ink: '#0d2a24', muted: 'rgba(13,42,36,0.74)' },
    cover: { src: 'home/skillender.jpg', alt: 'SkilLender website pages for products, workshops and featured vendors' },
    band: { src: 'work/skillender.jpg', alt: 'SkilLender website pages', bg: '#cbf3ed', marker: '#14ad7d', dark: false },
    meta: { type: 'UX Design', scope: [] },
  },
  {
    slug: 'gosafe',
    name: 'Go Safe',
    mark: 'GoSafe',
    category: 'UX Design',
    description:
      'is a student-focused safety and night transportation app that helps users plan their journeys, explore travel options, and navigate safely. It features emergency contacts, live safety checks, and quick access to help when needed.',
    accent: '#50b085',
    tone: { bg: '#151f32', ink: '#eef2f7', muted: 'rgba(238,242,247,0.72)' },
    cover: { src: 'home/gosafe.jpg', alt: 'Two phones showing the GoSafe live journey and safety setup screens' },
    band: { src: 'work/gosafe.png', alt: 'Two phones showing the GoSafe app', bg: '#151f32', marker: '#50b085', dark: true },
    meta: { type: 'UX Design', scope: [] },
  },
];

export const caseStudies = projects.filter((p) => p.href);

/** Accent for a route, used by the page-transition wipe. */
export function accentFor(pathname: string): string {
  const p = projects.find((x) => x.href && pathname.replace(/\/$/, '') === x.href);
  return p ? p.accent : '#141414';
}

export function nextProject(slug: string): Project {
  const i = caseStudies.findIndex((p) => p.slug === slug);
  return caseStudies[(i + 1) % caseStudies.length];
}
