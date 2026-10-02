import { defineConfig } from 'astro/config';

// Static output that mirrors the previous hand-rolled build:
// every page is emitted as /<slug>.html (Cloudflare Pages serves it at /<slug>),
// and HTML is left uncompressed so inline styles/markup render exactly as authored.
// SEO/performance post-processing runs afterwards in scripts/postbuild.mjs.
export default defineConfig({
  site: 'https://newcairoelevator.com',
  output: 'static',
  trailingSlash: 'never',
  compressHTML: false,
  build: { format: 'file', assets: '_astro' }
});
