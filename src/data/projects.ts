// The five projects shown on the home and work pages. Colors come from the Figma file.
export interface Project {
  slug: string;
  name: string;
  /** Name as it appears highlighted at the start of the description. */
  mark: string;
  category: string;
  color: string;
  markColor: string;
  markWeight: 600 | 700;
  button: { border: string; text: string };
  /** Case study URL; projects without one show a "Coming soon" pill. */
  href?: string;
  description: string;
  cover: { src: string; alt: string; maxWidth: number };
  band: { src: string; alt: string; bg: string; marker: string; dark: boolean };
}

export const projects: Project[] = [
  {
    slug: 'prisma',
    name: 'Prisma',
    mark: 'PRISMA',
    category: 'Industrial Design',
    color: '#0034ad',
    markColor: 'inherit',
    markWeight: 600,
    button: { border: '#000', text: '#000' },
    href: '/prisma',
    description:
      'is a portable, multifunctional speaker designed for fitness and dance instructors, combining powerful sound, customizable RGB lighting, and hands-free voice amplification.',
    cover: { src: 'home/prisma.jpg', alt: 'Two Prisma speakers with glowing RGB light edges on a black background', maxWidth: 793 },
    band: { src: 'work/prisma.jpg', alt: 'Two Prisma speakers with glowing RGB light edges', bg: '#000', marker: '#fce5d6', dark: true },
  },
  {
    slug: 'tiffin',
    name: 'Tiffin',
    mark: 'TIFFIN',
    category: 'Industrial Design',
    color: '#ab0782',
    markColor: '#ea6c4f',
    markWeight: 600,
    button: { border: '#c96d5a', text: '#e96b4d' },
    href: '/tiffin',
    description:
      'is a modern commuter food carrier inspired by Lahore’s rich food culture, celebrating the tradition of sharing homemade meals, eating together, and connecting with others through food.',
    cover: { src: 'home/tiffin.jpg', alt: 'Coral Tiffin lunchbox open to show rice and four steel containers', maxWidth: 803 },
    band: { src: 'work/tiffin.jpg', alt: 'Coral Tiffin lunchbox with its lid lifted', bg: '#fafbfd', marker: '#9c4747', dark: false },
  },
  {
    slug: 'pennie',
    name: 'Pennie',
    mark: 'Pennie',
    category: 'UX Design',
    color: '#6e660a',
    markColor: '#d5ee74',
    markWeight: 600,
    button: { border: '#d5ee74', text: '#d5ee74' },
    href: '/pennie',
    description:
      'is a smart, user-friendly app designed to make budgeting, saving, and tracking expenses easier; especially for people juggling careers, family, and unpredictable incomes.',
    cover: { src: 'home/pennie.jpg', alt: 'Two phones showing the Pennie budgeting app home screen', maxWidth: 778 },
    band: { src: 'work/pennie.jpg', alt: 'Two phones showing the Pennie budgeting app', bg: '#2c2c2c', marker: '#d5ee74', dark: true },
  },
  {
    slug: 'skillender',
    name: 'SkilLender',
    mark: 'SkilLender',
    category: 'UX Design',
    color: '#5f00ad',
    markColor: '#14ad7d',
    markWeight: 600,
    button: { border: '#14ad7d', text: '#14ad7d' },
    description:
      'connects skilled artisans and professionals with underserved learners through hands-on workshops, empowering them with practical skills to achieve financial independence.',
    cover: { src: 'home/skillender.jpg', alt: 'SkilLender website pages for products, workshops and featured vendors', maxWidth: 779 },
    band: { src: 'work/skillender.jpg', alt: 'SkilLender website pages', bg: '#cbf3ed', marker: '#14ad7d', dark: false },
  },
  {
    slug: 'gosafe',
    name: 'Go Safe',
    mark: 'GoSafe',
    category: 'UX Design',
    color: '#0034ad',
    markColor: '#69a48c',
    markWeight: 700,
    button: { border: '#000', text: '#000' },
    description:
      'is a student-focused safety and night transportation app that helps users plan their journeys, explore travel options, and navigate safely. It features emergency contacts, live safety checks, and quick access to help when needed.',
    cover: { src: 'home/gosafe.jpg', alt: 'Two phones showing the GoSafe live journey and safety setup screens', maxWidth: 546 },
    band: { src: 'work/gosafe.png', alt: 'Two phones showing the GoSafe app', bg: '#151f32', marker: '#50b085', dark: true },
  },
];
