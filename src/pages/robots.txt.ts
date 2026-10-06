import type { APIRoute } from 'astro';

// Preview builds (GitHub Pages) are closed to crawlers so they never compete with icehockeylife.ru.
export const GET: APIRoute = ({ site }) => {
  const preview = import.meta.env.PUBLIC_PREVIEW === '1';
  const body = preview
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', new URL(import.meta.env.BASE_URL, site)).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
