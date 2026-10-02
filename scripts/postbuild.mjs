import { access, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

// Runs after `astro build`. Astro (BaseLayout + src/lib/site.ts) already renders the head, SEO
// tags, sitemap.xml and robots.txt; this script only does what needs the finished HTML:
// local link check, clean internal URLs, inline/global CSS minify, _redirects.
const entries = await readdir(dist, { withFileTypes: true });
const htmlFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.html')).map((entry) => entry.name);

const internalPages = new Set(['design-system-preview.html', 'review-pages.html', '404.html', 'thank-you.html']);
const cleanPath = (file) => file === 'index.html' ? '/' : `/${file.replace(/\.html$/i, '')}`;

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .trim();
}

// Inline <style> blocks are most of each page's HTML weight; minifying them shortens time to first render.
function minifyInlineStyles(html) {
  return html.replace(/<style>([\s\S]*?)<\/style>/g, (_match, css) => `<style>${minifyCss(css)}</style>`);
}

// Local files referenced by src / srcset / poster (e.g. AVIF and -720 variants from scripts/make-images.mjs).
function assetRefs(html) {
  const refs = new Set();
  for (const [, attr, value] of html.matchAll(/\s(src|srcset|poster)="([^"]+)"/g)) {
    const urls = attr === 'srcset' ? value.split(',').map((part) => part.trim().split(/\s+/)[0]) : [value];
    for (const url of urls) if (/^\/?assets\//.test(url)) refs.add(url.replace(/^\//, '').split('?')[0]);
  }
  return refs;
}

function cleanInternalLinks(html) {
  return html.replace(/href=(["'])(?:\.\/)?([A-Za-z0-9_-]+)\.html([?#][^"']*)?\1/g, (match, quote, slug, suffix = '') => {
    const file = `${slug}.html`;
    if (!htmlFiles.includes(file) || internalPages.has(file)) return match;
    const target = file === 'index.html' ? '/' : `/${slug}`;
    return `href=${quote}${target}${suffix}${quote}`;
  });
}

const publicPages = new Set(htmlFiles);
const linkPattern = /href=["'](?![a-z]+:)([^"'#?]+\.html)(?:[?#][^"']*)?["']/g;

for (const file of htmlFiles) {
  let html = await readFile(path.join(dist, file), 'utf8');
  for (const match of html.matchAll(linkPattern)) {
    const local = match[1].replace(/^\.\//, '');
    if (!publicPages.has(local)) throw new Error(`Broken local page link in ${file}: ${match[1]}`);
  }
  for (const ref of assetRefs(html)) {
    try { await access(path.join(dist, ref)); } catch { throw new Error(`Missing asset in ${file}: ${ref}`); }
  }
  html = cleanInternalLinks(html);
  html = minifyInlineStyles(html);
  await writeFile(path.join(dist, file), html, 'utf8');
}

const globalCssPath = path.join(dist, 'assets', 'css', 'global.css');
let globalCss = await readFile(globalCssPath, 'utf8');
globalCss = minifyCss(globalCss.replace(/@import\s+url\([^;]+\);?/gi, ''));
await writeFile(globalCssPath, globalCss, 'utf8');

const redirects = htmlFiles
  .filter((file) => !internalPages.has(file))
  .map((file) => file === 'index.html' ? '/index.html / 301' : `/${file} ${cleanPath(file)} 301`);
await writeFile(path.join(dist, '_redirects'), `${redirects.join('\n')}\n`, 'utf8');

console.log(`Post-processed ${htmlFiles.length} Astro pages in dist/ (link check, clean URLs, minify, redirects).`);
