// Site-wide constants and SEO data shared by BaseLayout and the sitemap/robots endpoints.

export const SITE = 'https://newcairoelevator.com';
export const SITE_NAME = 'القاهرة الجديدة للمصاعد';
const BUSINESS_ID = `${SITE}/#business`;
const WEBSITE_ID = `${SITE}/#website`;
const MAP_URL = 'https://maps.google.com/?cid=6830831853888756111';

/** Pages that get no canonical/OG/JSON-LD and stay out of the sitemap. */
export const INTERNAL_PAGES = new Set(['design-system-preview', 'review-pages', '404', 'thank-you']);
/** Pages blocked in robots.txt. */
export const ROBOTS_BLOCKED = ['review-pages', 'design-system-preview', 'thank-you'];
/** Product pages: own OG image (assets/images/products/<slug>/og.jpg) and a Service node. */
export const PRODUCT_PAGES = new Set([
  'gearless-elevator', 'gearbox-elevator', 'gearbox-automatic-doors', 'electric-elevator',
  'hydraulic-panoramic-elevator', 'hospital-elevator', 'outdoor-elevator', 'elevator-maintenance'
]);

/** Slug of a page from its URL ('/' or '/index.html' → 'index', '/faq.html' → 'faq'). */
export const slugFromPath = (pathname: string) =>
  pathname.replace(/^\/+/, '').replace(/\.html$/, '').replace(/\/$/, '') || 'index';

export const cleanUrl = (slug: string) => `${SITE}${slug === 'index' ? '/' : `/${slug}`}`;

/** Slugs of the static .astro pages in src/pages (dynamic routes like [product] excluded). */
export const staticPageSlugs = () =>
  Object.keys(import.meta.glob('../pages/*.astro'))
    .map((file) => file.replace('../pages/', '').replace('.astro', ''))
    .filter((slug) => !slug.includes('['));

export const ogImage = (slug: string) =>
  `${SITE}/assets/images/${PRODUCT_PAGES.has(slug) ? `products/${slug}/og.jpg` : 'brand/og-default.jpg'}`;

export function structuredData(slug: string, title: string, description: string) {
  const url = cleanUrl(slug);
  const graph: Record<string, unknown>[] = [
    {
      '@type': ['LocalBusiness', 'Organization'],
      '@id': BUSINESS_ID,
      name: SITE_NAME,
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
      geo: { '@type': 'GeoCoordinates', latitude: 30.0533, longitude: 31.459 },
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

  if (slug === 'index') {
    graph.push({
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: `${SITE}/`,
      name: SITE_NAME,
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

  if (PRODUCT_PAGES.has(slug)) {
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

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}
