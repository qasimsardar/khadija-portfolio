# Khadija Sardar — Portfolio

Static portfolio site built with [Astro](https://astro.build), GSAP and Lenis. Originally rebuilt from the Figma Sites
export `Khadija Sardar's Portfolio.site`, then redesigned with a motion system.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # build, then serve dist/ in the local Cloudflare Workers runtime (http://localhost:8787)
```

## Deploy (Cloudflare Workers)

The site deploys as a Worker with static assets (`wrangler.jsonc`). Pages, images, fonts and scripts are served
straight from Cloudflare's asset storage. A tiny Worker (`worker/index.js`) runs only for `/video/*`, because static
assets ignore byte-range requests and iPhone Safari won't play the Prisma film without them.

**From your machine**

```bash
npx wrangler login   # once
npm run deploy       # builds, then uploads; prints the *.workers.dev URL
npm run deploy:dry   # checks the build and config without uploading
```

**From GitHub (deploys on every push to `main`)**: in the Cloudflare dashboard go to *Workers & Pages → Create →
Import a repository*, pick `qasimsardar/khadija-portfolio`, and set build command `npm run build` and deploy
command `npx wrangler deploy`.

**Custom domain**: add `khadijasardar.com` to the same Cloudflare account, uncomment the `routes` block in
`wrangler.jsonc`, and deploy again. Cloudflare creates the DNS records and certificate.

What the deploy setup handles:

- Clean URLs: pages build to `prisma.html` and are served at `/prisma` (`/prisma/` and `/prisma.html` redirect
  there), matching the canonical links and sitemap.
- `public/_headers`: long-term caching for fingerprinted `/_astro/*` files, a week for `/video/*`, and basic
  security headers on everything.
- `public/_redirects`: the old Figma Sites paths (`/project_prisma-5`, `/project_pennie-3`, `/page-3`).
- Unknown paths show `src/pages/404.astro` with a real 404 status.
- Limit to keep in mind: Cloudflare caps each static file at 25 MiB. The Prisma video is 23.8 MB, so re-encode any
  replacement to stay under that.

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
- `public/video/`: the Prisma product video and its poster. `src/pages/video/sizes.json.ts` records their sizes at
  build time for the range-request Worker.

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
