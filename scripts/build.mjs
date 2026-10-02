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

const SITE = 'https://newcairoelevator.com';
const BUSINESS_ID = `${SITE}/#business`;
const WEBSITE_ID = `${SITE}/#website`;
const MAP_URL = 'https://maps.google.com/?cid=6830831853888756111';
const internalPages = new Set(['design-system-preview.html', 'review-pages.html', '404.html', 'thank-you.html']);
const productPages = new Set(['gearless-elevator.html', 'gearbox-elevator.html', 'gearbox-automatic-doors.html', 'electric-elevator.html', 'hydraulic-panoramic-elevator.html', 'hospital-elevator.html', 'outdoor-elevator.html', 'elevator-maintenance.html']);
const attr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const cleanPath = (file) => file === 'index.html' ? '/' : `/${file.replace(/\.html$/i, '')}`;
const cleanUrl = (file) => `${SITE}${cleanPath(file)}`;
const pageTitle = (html) => (html.match(/<title>([^<]*)<\/title>/) || [])[1] || 'القاهرة الجديدة للمصاعد';
const pageDescription = (html) => (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';

function socialMeta(file, html) {
  if (internalPages.has(file)) return html;
  const title = pageTitle(html);
  const description = pageDescription(html);
  const url = cleanUrl(file);
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

  html = html
    .replace(/\s*<link rel="canonical"[^>]*>/gi, '')
    .replace(/\s*<meta property="og:[^"]+"[^>]*>/gi, '')
    .replace(/\s*<meta name="twitter:[^"]+"[^>]*>/gi, '');
  return html.replace('</head>', `${tags}\n</head>`);
}

function structuredData(file, html) {
  if (internalPages.has(file)) return html;
  const title = pageTitle(html);
  const description = pageDescription(html);
  const url = cleanUrl(file);
  const graph = [
    {
      '@type': ['LocalBusiness', 'Organization'],
      '@id': BUSINESS_ID,
      name: 'القاهرة الجديدة للمصاعد',
      alternateName: 'شركة القاهره الجديده للمصاعد',
      url: `${SITE}/`,
      logo: `${SITE}/assets/images/brand/logo.webp`,
      image: `${SITE}/assets/images/brand/og-default.jpg`,
      telephone: '+201060781020',
      hasMap: MAP_URL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: '3F35+8J8',
        addressLocality: 'قسم أول القاهرة الجديدة',
        addressRegion: 'محافظة القاهرة',
        postalCode: '4734250',
        addressCountry: 'EG'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 30.0533,
        longitude: 31.459
      },
      areaServed: { '@type': 'Place', name: 'القاهرة الجديدة، مصر' },
      contactPoint: [{
        '@type': 'ContactPoint',
        telephone: '+201060781020',
        contactType: 'customer service',
        areaServed: 'EG',
        availableLanguage: ['ar']
      }]
    },
    {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      url,
      name: title,
      description,
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': BUSINESS_ID },
      inLanguage: 'ar-EG'
    }
  ];

  if (file === 'index.html') {
    graph.push({
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: `${SITE}/`,
      name: 'القاهرة الجديدة للمصاعد',
      publisher: { '@id': BUSINESS_ID },
      inLanguage: 'ar-EG'
    });
  } else {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: title, item: url }
      ]
    });
  }

  if (productPages.has(file)) {
    graph.push({
      '@type': 'Service',
      '@id': `${url}#service`,
      name: title,
      description,
      url,
      provider: { '@id': BUSINESS_ID },
      areaServed: { '@type': 'Place', name: 'القاهرة الجديدة، مصر' },
      serviceType: title
    });
  }

  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\u003c');
  return html.replace('</head>', `<script type="application/ld+json">${json}</script>\n</head>`);
}

function performanceHints(file, html) {
  const hints = [
    '<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/alexandria-arabic.woff2" crossorigin>'
  ];
  if (file === 'index.html') {
    hints.push('<link rel="preload" as="image" href="/assets/images/home/hero-luxury-elevator-lobby.webp" imagesrcset="/assets/images/home/hero-luxury-elevator-lobby-860.webp 860w, /assets/images/home/hero-luxury-elevator-lobby.webp 1122w" imagesizes="(max-width: 900px) 100vw, 50vw" type="image/webp" fetchpriority="high">');
  }
  const block = `${hints.join('\n')}\n`;
  if (html.includes('<style>')) return html.replace('<style>', `${block}<style>`);
  return html.replace('</head>', `${block}</head>`);
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
  let html = await readFile(path.join(root, file), 'utf8');
  for (const match of html.matchAll(linkPattern)) {
    const local = match[1].replace(/^\.\//, '');
    if (!publicPages.has(local)) throw new Error(`Broken local page link in ${file}: ${match[1]}`);
  }
  if (html.includes(HEADER_MARKER)) html = html.replace(HEADER_MARKER, header);
  if (html.includes(FOOTER_MARKER)) html = html.replace(FOOTER_MARKER, footer);
  html = cleanInternalLinks(html);
  html = performanceHints(file, html);
  html = socialMeta(file, html);
  html = structuredData(file, html);
  if (html.includes('@component:site-')) throw new Error(`Unresolved layout component in ${file}`);
  await writeFile(path.join(dist, file), html, 'utf8');
}

await cp(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true });
for (const file of ['manifest.json']) {
  await cp(path.join(root, file), path.join(dist, file));
}

const globalCssPath = path.join(dist, 'assets', 'css', 'global.css');
let globalCss = await readFile(globalCssPath, 'utf8');
globalCss = globalCss
  .replace(/@import\s+url\([^;]+\);?/gi, '')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,])\s*/g, '$1')
  .trim();
await writeFile(globalCssPath, globalCss, 'utf8');

const sitemapUrls = htmlFiles
  .filter((file) => !internalPages.has(file))
  .map((file) => `  <url><loc>${cleanUrl(file)}</loc></url>`);
await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.join('\n')}\n</urlset>\n`, 'utf8');

const blocked = ['review-pages', 'design-system-preview', 'thank-you'];
await writeFile(path.join(dist, 'robots.txt'), [
  'User-agent: *',
  'Allow: /assets/',
  ...blocked.flatMap((slug) => [`Disallow: /${slug}`, `Disallow: /${slug}.html`]),
  '',
  `Sitemap: ${SITE}/sitemap.xml`,
  ''
].join('\n'), 'utf8');

const redirects = htmlFiles
  .filter((file) => !internalPages.has(file))
  .map((file) => file === 'index.html' ? '/index.html / 301' : `/${file} ${cleanPath(file)} 301`);
await writeFile(path.join(dist, '_redirects'), `${redirects.join('\n')}\n`, 'utf8');

console.log(`Built ${htmlFiles.length} HTML pages into dist/ with clean URLs, structured data and SEO/performance optimizations.`);
