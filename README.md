# Khadija Sardar — Portfolio

Static portfolio site built with [Astro](https://astro.build), GSAP and Lenis. Originally rebuilt from the Figma Sites
export `Khadija Sardar's Portfolio.site`, then redesigned with a motion system.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # serve dist/ locally
```

## Pages

| Route     | What it is                                                   |
| --------- | ------------------------------------------------------------ |
| `/`       | Hero, selected work, marquee, About (portrait, skills)       |
| `/work`   | Project index with hover previews, then the project bands     |
| `/prisma` | Case study                                                   |
| `/tiffin` | Case study                                                   |
| `/pennie` | Case study                                                   |

SkilLender and Go Safe have no case studies yet, so they appear as locked "coming soon" cards.

## Editing content

- `src/data/site.ts`: name, contact links, "Available for work" toggle, About section (statement, skills, and the
  still-empty `bio`, `tools`, `education`, which appear on the site as soon as they're filled in).
- `src/data/projects.ts`: the five projects (copy, accent colour, page tone, images) and each case study's meta strip.
  `role`, `year` and `tools` are empty because they weren't in the Figma file; fill them in to show them.
- `src/assets/<page>/`: images exported from the Figma file at 2×. Astro turns them into responsive AVIF/WebP.
- `public/video/`: the Prisma product video and its poster.

## How the motion works

- `src/scripts/motion.ts` is the single entry point. It starts Lenis smooth scrolling (driven by GSAP's ticker),
  runs the shared reveals, and calls the page module for the current route. It re-runs on every `astro:page-load`
  and cleans up on `astro:before-swap`, so it works with Astro's client-side navigation.
- Shared reveals are attribute-driven: `data-reveal` (fade + rise, or `="clip"` for an image wipe), `data-stagger`,
  `data-split` (masked line reveal), `data-words` (word-by-word on scroll), `data-parallax`, `data-count`.
- Page-specific effects live in `src/scripts/pages/*.ts`; global UI (cursor, magnetic buttons, nav, page wipe,
  preloader) lives in `src/scripts/ui/*.ts`.
- Easings and durations are shared tokens (`--ease-out`, `--ease-inout`, `--dur-1..3` in `global.css`, `EASE`/`DUR`
  in `motion.ts`).
- Nothing is hidden without JavaScript: initial states only apply under `html.js`, and a failsafe removes that class if
  the motion bundle doesn't start. With `prefers-reduced-motion`, Lenis, parallax, pinning and transforms are off;
  content in view stays put and content below the fold only fades.
