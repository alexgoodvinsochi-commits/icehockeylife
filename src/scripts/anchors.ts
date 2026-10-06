// Sections below the first screen use content-visibility: auto (see base.css), so until they are drawn
// their height is only an estimate. Right before any jump to an in-page anchor, switch that off for good:
// the browser lays out the real page once and the jump lands exactly on the section.
export function initAnchors() {
  const root = document.documentElement;
  const settle = () => root.classList.add('cv-all');
  document.addEventListener(
    'click',
    (e) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="#"]');
      if (a && a.hash.length > 1 && a.pathname === location.pathname) settle();
    },
    true, // capture: runs before the default jump and before dialogs.ts scrolls from inside the menu
  );
  window.addEventListener('hashchange', settle);
}
