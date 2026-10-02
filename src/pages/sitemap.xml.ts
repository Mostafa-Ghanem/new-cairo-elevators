import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { INTERNAL_PAGES, staticPageSlugs, cleanUrl } from '../lib/site';

// Kept at /sitemap.xml (the URL submitted to Search Console) with clean URLs.
export const GET: APIRoute = async () => {
  const products = (await getCollection('products')).map((entry) => entry.id);
  const urls = [...staticPageSlugs(), ...products]
    .sort()
    .filter((slug) => !INTERNAL_PAGES.has(slug))
    .map((slug) => `  <url><loc>${cleanUrl(slug)}</loc></url>`);
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
