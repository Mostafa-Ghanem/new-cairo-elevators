import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

// Runs after `astro build`. Astro (BaseLayout + src/lib/site.ts) already renders the head, SEO
// tags, sitemap.xml and robots.txt; this script only does what needs the finished HTML:
// local link check, clean internal URLs, inline/global CSS minify, LQIP placeholders, _redirects.
const entries = await readdir(dist, { withFileTypes: true });
const htmlFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.html')).map((entry) => entry.name);

const internalPages = new Set(['design-system-preview.html', 'review-pages.html', '404.html', 'thank-you.html']);
const cleanPath = (file) => file === 'index.html' ? '/' : `/${file.replace(/\.html$/i, '')}`;

// Tiny blurred previews (scripts/lqip.json, made by scripts/make-lqip.sh) painted behind each
// photo, so a card shows a soft version of its image instead of an empty box while it downloads.
const lqip = JSON.parse(await readFile(path.join(root, 'scripts', 'lqip.json'), 'utf8'));
function addLqip(html) {
  return html.replace(/<img\b[^>]*>/g, (tag) => {
    const src = (tag.match(/\ssrc="\/?(assets\/images\/[^"]+)"/) || [])[1];
    if (!src || !lqip[src] || /\sstyle=/.test(tag)) return tag;
    return tag.replace('<img', `<img style="background:url(${lqip[src]}) center/cover"`);
  });
}

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .trim();
}

// Inline <style> blocks are most of each page's HTML weight; minifying them shortens time to first render.
function minifyInlineStyles(html) {
  return html.replace(/<style>([\s\S]*?)<\/style>/g, (match, css) => `<style>${minifyCss(css)}</style>`);
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
  html = cleanInternalLinks(html);
  html = minifyInlineStyles(html);
  html = addLqip(html);
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

console.log(`Post-processed ${htmlFiles.length} Astro pages in dist/ (link check, clean URLs, minify, LQIP, redirects).`);
