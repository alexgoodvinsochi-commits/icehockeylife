// Sign-up form: validates the fields, builds the message for the head coach and opens WhatsApp with it.
// Nothing is sent to any server — the parent sends the message from their own phone.
// WhatsApp has been blocked in Russia since February 2026 and often works only for some people, so the same
// request also goes as a short SMS, a copied text or a call, and the page asks whether the message left
// when the parent comes back from WhatsApp (a stuck message only shows a clock icon there).

import { camp, contacts } from '../data/camp';
import { goal } from './goals';

export type Lead = {
  parent: string;
  phone: string;
  age: string;
  position: string;
};

/** where the consent document lives, quoted in every message as the only record of the checkbox */
export type Consent = { url: string; revision?: string };

const digits = (v: string) => v.replace(/\D/g, '');

/** «+375…», «+372…», «00…»: anything typed with a country code other than 7 */
const isForeign = (v: string) => /^\s*(\+(?!7)|00)/.test(v);

/** Russian numbers get the +7 (938) 438-91-63 mask (from 8…, 7…, +7… or bare 9…); foreign ones stay as typed. */
export function formatPhone(raw: string): string {
  if (isForeign(raw)) return '+' + digits(raw).replace(/^00/, '').slice(0, 15);
  let d = digits(raw);
  if (d.startsWith('8')) d = '7' + d.slice(1);
  if (!d.startsWith('7')) d = '7' + d;
  d = d.slice(0, 11);
  const p = d.slice(1);
  let out = '+7';
  if (p.length) out += ' (' + p.slice(0, 3);
  if (p.length >= 3) out += ')';
  if (p.length > 3) out += ' ' + p.slice(3, 6);
  if (p.length > 6) out += '-' + p.slice(6, 8);
  if (p.length > 8) out += '-' + p.slice(8, 10);
  return out;
}

export const phoneIsComplete = (v: string) => {
  const n = digits(v).length;
  return isForeign(v) ? n >= 8 && n <= 15 : n === 11;
};

const consentLine = (c: Consent) =>
  `Согласие на обработку персональных данных (моих и ребёнка) даю на условиях: ${c.url}${c.revision ? ` (ред. от ${c.revision})` : ''}`;

/** The full message for WhatsApp */
export function buildMessage(l: Lead, c: Consent): string {
  return [
    `Здравствуйте! Хочу записать ребёнка на ${camp.season.toLowerCase()} Ice Hockey Life: ${camp.place}, ${camp.datesHuman}.`,
    '',
    `Родитель: ${l.parent.trim()}`,
    `Телефон: ${l.phone}`,
    `Год рождения или возраст ребёнка: ${l.age.trim()}`,
    `Амплуа: ${l.position}`,
    '',
    consentLine(c),
  ].join('\n');
}

/** «4–10.01.2027» from the camp dates */
const shortDates = () => {
  const [y, m, d1] = camp.start.slice(0, 10).split('-');
  const d2 = camp.end.slice(8, 10);
  return `${Number(d1)}–${Number(d2)}.${m}.${y}`;
};

/** One line for SMS: Cyrillic SMS are 67 characters per part, so every word counts (3 parts with the consent) */
export function buildSms(l: Lead, c: Consent): string {
  const phone = isForeign(l.phone) ? l.phone : '+' + digits(l.phone);
  return (
    `Заявка на сборы IHL ${shortDates()} (${camp.place}): ${l.parent.trim()}, ${phone}, ` +
    `ребёнок: ${l.age.trim()}, ${l.position.toLowerCase()}. Согласие на обработку ПД: ${c.url}`
  );
}

export const whatsappLink = (text: string) =>
  `https://wa.me/${contacts.whatsapp}?text=${encodeURIComponent(text)}`;

/** `?&body=` is read by both Android (?body=) and iOS (&body=) messaging apps */
export const smsLink = (text: string) => `sms:${contacts.headCoach.tel}?&body=${encodeURIComponent(text)}`;

export function initLeadForm(form: HTMLFormElement) {
  const phone = form.elements.namedItem('phone') as HTMLInputElement;
  const consentBox = form.querySelector<HTMLInputElement>('[data-lead-consent]');
  const consentHint = form.querySelector<HTMLElement>('[data-lead-consent-hint]');
  const done = form.querySelector<HTMLElement>('[data-lead-done]');
  const nudge = form.querySelector<HTMLElement>('[data-lead-nudge]');
  const copyBtn = form.querySelector<HTMLButtonElement>('[data-lead-copy]');
  const preview = form.querySelector<HTMLElement>('[data-lead-preview]');
  const openLink = form.querySelector<HTMLAnchorElement>('[data-lead-open]');
  const smsBtn = form.querySelector<HTMLButtonElement>('[data-lead-sms]');
  const smsLinkEl = form.querySelector<HTMLAnchorElement>('[data-lead-sms-link]');
  const consent: Consent = { url: form.dataset.consentUrl ?? '', revision: form.dataset.revision || undefined };
  let lastMessage = '';
  let waPending = false;

  phone.addEventListener('input', () => {
    const atEnd = phone.selectionStart === phone.value.length;
    phone.value = phone.value ? formatPhone(phone.value) : '';
    if (atEnd) phone.setSelectionRange(phone.value.length, phone.value.length);
    phone.setCustomValidity('');
  });
  phone.addEventListener('blur', () => {
    if (digits(phone.value).length <= 1) phone.value = '';
  });
  consentBox?.addEventListener('change', () => {
    if (consentBox.checked && consentHint) consentHint.hidden = true;
  });

  /** validate, build both texts and show the «message is ready» panel; null if the form is not valid */
  const prepare = (): { text: string; sms: string } | null => {
    if (phone.value && !phoneIsComplete(phone.value)) {
      phone.setCustomValidity(isForeign(phone.value) ? 'Проверьте номер: нужно от 8 до 15 цифр после «+»' : 'Проверьте номер: нужно 10 цифр после +7');
    }
    if (consentHint && consentBox) consentHint.hidden = consentBox.checked;
    if (!form.reportValidity()) return null;
    const data = new FormData(form);
    const lead: Lead = {
      parent: String(data.get('parent') ?? ''),
      phone: phone.value,
      age: String(data.get('age') ?? ''),
      position: String(data.get('position') ?? ''),
    };
    lastMessage = buildMessage(lead, consent);
    const sms = buildSms(lead, consent);
    if (preview) preview.textContent = lastMessage;
    if (openLink) openLink.href = whatsappLink(lastMessage);
    if (smsLinkEl) smsLinkEl.href = smsLink(sms);
    if (done) {
      done.hidden = false;
      done.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      done.focus({ preventScroll: true });
    }
    form.classList.add('is-done');
    return { text: lastMessage, sms };
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const r = prepare();
    if (!r) return;
    goal('lead_whatsapp');
    waPending = true;
    window.open(whatsappLink(r.text), '_blank', 'noopener');
  });

  openLink?.addEventListener('click', () => {
    goal('lead_whatsapp_again');
    waPending = true;
  });

  smsBtn?.addEventListener('click', () => {
    const r = prepare();
    if (!r) return;
    goal('lead_sms');
    window.location.href = smsLink(r.sms);
  });
  smsLinkEl?.addEventListener('click', () => goal('lead_sms'));

  // back from WhatsApp: a message that could not leave the phone only shows a clock icon there
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible' || !waPending || !nudge) return;
    waPending = false;
    nudge.hidden = false;
    goal('lead_nudge');
  });

  copyBtn?.addEventListener('click', async () => {
    goal('lead_copy');
    try {
      await navigator.clipboard.writeText(lastMessage);
      copyBtn.textContent = 'Скопировано';
    } catch {
      // in-app browsers often block the clipboard: select the text so a long press copies it
      if (preview) {
        const range = document.createRange();
        range.selectNodeContents(preview);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      copyBtn.textContent = 'Текст выделен — скопируйте его';
    }
  });
}
