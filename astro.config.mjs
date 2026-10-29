import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://khadijasardar.com',
  integrations: [sitemap()],
  // Clean URLs for Cloudflare Workers static assets: pages build to /prisma.html and are served at /prisma
  // (see html_handling in wrangler.jsonc), so internal links, canonicals and the sitemap all match without redirects.
  trailingSlash: 'never',
  build: { format: 'file' },
  devToolbar: { enabled: false },
});
