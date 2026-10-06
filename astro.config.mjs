// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

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
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Golos Text',
      cssVariable: '--font-text',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext', 'cyrillic'],
      fallbacks: ['Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Handjet',
      cssVariable: '--font-led',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
      fallbacks: ['monospace'],
    },
  ],
});
