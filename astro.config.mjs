// @ts-check
import { defineConfig } from 'astro/config';

// Preview (GitHub Pages) and production (icehockeylife.ru) differ only by these env variables.
const site = process.env.SITE_URL ?? 'https://icehockeylife.ru';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  // Astro 7 defaults to JSX-style whitespace stripping, which would glue Russian words around inline tags
  compressHTML: true,
  build: {
    inlineStylesheets: 'always',
  },
  image: {
    layout: 'constrained',
  },
});
