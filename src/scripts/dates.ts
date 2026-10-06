// Date-aware content for a static site that is not rebuilt every day.
// [data-until="ISO"]  — shown only before the moment, removed after it
// [data-from="ISO"]   — hidden before the moment, shown after it
// [data-countdown="ISO"] — text becomes «N дней» until the moment (today counts: on the last day it is 1,
//                          and data-countdown-last, if given, replaces the whole line). The line ships hidden
//                          and appears only once the number is written.

const plural = (n: number, forms: [string, string, string]) => {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return forms[0];
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return forms[1];
  return forms[2];
};

export const daysWord = (n: number) => plural(n, ['день', 'дня', 'дней']);

export function daysUntil(iso: string, now = Date.now()) {
  return Math.ceil((new Date(iso).getTime() - now) / 86_400_000);
}

export function applyDates(root: ParentNode = document, now = Date.now()) {
  root.querySelectorAll<HTMLElement>('[data-until]').forEach((el) => {
    el.hidden = now > new Date(el.dataset.until!).getTime();
  });
  root.querySelectorAll<HTMLElement>('[data-from]').forEach((el) => {
    el.hidden = now < new Date(el.dataset.from!).getTime();
  });
  root.querySelectorAll<HTMLElement>('[data-countdown]').forEach((el) => {
    const d = daysUntil(el.dataset.countdown!, now);
    if (d <= 0) {
      el.hidden = true;
      return;
    }
    if (d === 1 && el.dataset.countdownLast) {
      el.textContent = el.dataset.countdownLast;
    } else {
      const num = el.querySelector<HTMLElement>('[data-countdown-num]');
      const word = el.querySelector<HTMLElement>('[data-countdown-word]');
      if (num) num.textContent = String(d);
      if (word) word.textContent = daysWord(d);
    }
    el.hidden = false;
  });
}

/** Apply now, and again when a tab left open comes back or the clock passes midnight on the deadline */
export function watchDates() {
  applyDates();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') applyDates();
  });
  setInterval(() => applyDates(), 60_000);
}
