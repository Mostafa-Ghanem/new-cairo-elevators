import type { APIRoute } from 'astro';
import { ROBOTS_BLOCKED, SITE } from '../lib/site';

export const GET: APIRoute = () => {
  const body = [
    'User-agent: *',
    'Allow: /assets/',
    ...ROBOTS_BLOCKED.flatMap((slug) => [`Disallow: /${slug}`, `Disallow: /${slug}.html`]),
    '',
    `Sitemap: ${SITE}/sitemap.xml`,
    ''
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
