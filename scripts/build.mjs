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

const SITE = 'https://newcairoelevators.com';
const internalPages = new Set(['design-system-preview.html', 'review-pages.html', '404.html', 'thank-you.html']);
const productPages = new Set(['gearless-elevator.html', 'gearbox-elevator.html', 'gearbox-automatic-doors.html', 'electric-elevator.html', 'hydraulic-panoramic-elevator.html', 'hospital-elevator.html', 'outdoor-elevator.html', 'elevator-maintenance.html']);
const attr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

// Canonical + Open Graph + Twitter tags, generated from each page's own <title>/<meta description>.
function socialMeta(file, html) {
  if (internalPages.has(file) || html.includes('property="og:title"')) return html;
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || 'القاهرة الجديدة للمصاعد';
  const description = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const url = `${SITE}/${file === 'index.html' ? '' : file}`;
  const image = `${SITE}/assets/images/${productPages.has(file) ? `products/${file.replace('.html', '')}/og.jpg` : 'brand/og-default.jpg'}`;
  const tags = [
    `<link rel="canonical" href="${url}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:locale" content="ar_EG">',
    '<meta property="og:site_name" content="القاهرة الجديدة للمصاعد">',
    `<meta property="og:title" content="${attr(title)}">`,
    `<meta property="og:description" content="${attr(description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${image}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="${attr(title)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${attr(title)}">`,
    `<meta name="twitter:description" content="${attr(description)}">`,
    `<meta name="twitter:image" content="${image}">`
  ].join('\n');
  return html.replace('</head>', `${tags}\n</head>`);
}

for (const file of htmlFiles) {
  let html = await readFile(path.join(root, file), 'utf8');
  if (html.includes(HEADER_MARKER)) html = html.replace(HEADER_MARKER, header);
  if (html.includes(FOOTER_MARKER)) html = html.replace(FOOTER_MARKER, footer);
  html = socialMeta(file, html);
  if (html.includes('@component:site-')) throw new Error(`Unresolved layout component in ${file}`);
  await writeFile(path.join(dist, file), html, 'utf8');
}

await cp(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true });
for (const file of ['manifest.json']) {
  await cp(path.join(root, file), path.join(dist, file));
}

const publicPages = new Set(htmlFiles);
const linkPattern = /href=["'](?![a-z]+:)([^"'#?]+\.html)(?:[?#][^"']*)?["']/g;
for (const file of htmlFiles) {
  const html = await readFile(path.join(dist, file), 'utf8');
  for (const match of html.matchAll(linkPattern)) {
    if (!publicPages.has(match[1])) throw new Error(`Broken local page link in ${file}: ${match[1]}`);
  }
}

const sitemapUrls = htmlFiles
  .filter((file) => !internalPages.has(file))
  .map((file) => `  <url><loc>${SITE}/${file === 'index.html' ? '' : file}</loc></url>`);
await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.join('\n')}\n</urlset>\n`, 'utf8');
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nDisallow: /review-pages.html\nDisallow: /design-system-preview.html\nDisallow: /thank-you.html\n\nSitemap: ${SITE}/sitemap.xml\n`, 'utf8');

console.log(`Built ${htmlFiles.length} HTML pages into dist/ with shared layout components.`);
