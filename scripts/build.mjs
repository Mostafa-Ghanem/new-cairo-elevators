import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const headerPath = path.join(root, 'components', 'site-header.html');
const footerPath = path.join(root, 'components', 'site-footer.html');
const HEADER_MARKER = '<!-- @component:site-header -->';
const FOOTER_MARKER = '<!-- @component:site-footer -->';

const [header, footer] = await Promise.all([
  readFile(headerPath, 'utf8'),
  readFile(footerPath, 'utf8')
]);

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const entries = await readdir(root, { withFileTypes: true });
const htmlFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.html')).map((entry) => entry.name);

for (const file of htmlFiles) {
  let html = await readFile(path.join(root, file), 'utf8');
  if (html.includes(HEADER_MARKER)) html = html.replace(HEADER_MARKER, header);
  if (html.includes(FOOTER_MARKER)) html = html.replace(FOOTER_MARKER, footer);
  if (html.includes('@component:site-')) throw new Error(`Unresolved layout component in ${file}`);
  await writeFile(path.join(dist, file), html, 'utf8');
}

await cp(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true });
for (const file of ['manifest.json']) {
  await cp(path.join(root, file), path.join(dist, file));
}

const publicPages = new Set(htmlFiles);
const linkPattern = /href=["']([^"'#?]+\.html)(?:[?#][^"']*)?["']/g;
for (const file of htmlFiles) {
  const html = await readFile(path.join(dist, file), 'utf8');
  for (const match of html.matchAll(linkPattern)) {
    if (!publicPages.has(match[1])) throw new Error(`Broken local page link in ${file}: ${match[1]}`);
  }
}

const SITE = 'https://newcairoelevators.com';
const internalPages = new Set(['design-system-preview.html', 'review-pages.html', '404.html']);
const sitemapUrls = htmlFiles
  .filter((file) => !internalPages.has(file))
  .map((file) => `  <url><loc>${SITE}/${file === 'index.html' ? '' : file}</loc></url>`);
await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.join('\n')}\n</urlset>\n`, 'utf8');
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nDisallow: /review-pages.html\nDisallow: /design-system-preview.html\n\nSitemap: ${SITE}/sitemap.xml\n`, 'utf8');

console.log(`Built ${htmlFiles.length} HTML pages into dist/ with shared layout components.`);
