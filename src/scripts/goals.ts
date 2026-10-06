// Yandex Metrica goals. The counter exists only on the production site and only after the visitor allowed
// cookies (CookieBanner.astro); everywhere else these calls do nothing. Goals never carry parameters,
// so no personal data from the form can reach Metrica.

import { contacts } from '../data/camp';

declare global {
  interface Window {
    ym?: (id: number, method: string, goal: string) => void;
    __metrikaId?: number;
  }
}

export const goal = (name: string) => {
  if (window.ym && window.__metrikaId) window.ym(window.__metrikaId, 'reachGoal', name);
};

/** Taps on the two phone numbers, wherever they are on the page */
export function initCallGoals() {
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="tel:"]');
    if (!a) return;
    goal(a.getAttribute('href') === `tel:${contacts.coordinator.tel}` ? 'call_coordinator' : 'call_coach');
  });
}
