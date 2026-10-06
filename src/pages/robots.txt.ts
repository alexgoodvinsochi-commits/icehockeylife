import type { APIRoute } from 'astro';
import { isPreview, siteBase } from '../lib/seo';

// Preview builds (GitHub Pages) are closed to crawlers so they never compete with icehockeylife.ru.
export const GET: APIRoute = ({ site }) => {
  const body = isPreview
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', siteBase(site)).href}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
