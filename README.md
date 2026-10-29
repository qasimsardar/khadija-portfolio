# Khadija Sardar — Portfolio

Static portfolio site built with [Astro](https://astro.build), rebuilt from the Figma Sites export
`Khadija Sardar's Portfolio.site`.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Pages

| Route     | Figma page          |
| --------- | ------------------- |
| `/`       | `/`                 |
| `/work`   | `/page-3`           |
| `/prisma` | `/project_prisma-5` |
| `/tiffin` | `/tiffin`           |
| `/pennie` | `/project_pennie-3` |

## Where things live

- `src/data/site.ts`: name, contact links (Email, Behance, LinkedIn) and the Pennie audit link (still empty, so that
  sentence is hidden). An empty link shows as plain text.
- `src/data/projects.ts`: the five projects shown on Home and Work.
- `src/assets/<page>/`: images exported from the Figma file exactly as cropped there (2x resolution). Astro converts
  them to responsive WebP at build time.
- `public/video/`: the Prisma product video (H.264 MP4) and its poster.
- `src/styles/global.css`: design tokens (fonts, colors, spacing) and shared styles.

Images are always rendered with `height: auto` from their real dimensions, so they keep their aspect ratio at every
screen size.
