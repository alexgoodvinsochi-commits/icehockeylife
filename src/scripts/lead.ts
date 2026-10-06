// Sign-up form: validates the fields, builds a ready-to-send WhatsApp message for the head coach
// and opens it. Nothing is sent to any server — the parent sends the message from their own messenger.

import { camp, contacts } from '../data/camp';

export type Lead = {
  parent: string;
  phone: string;
  age: string;
  position: string;
  comment?: string;
};

const digits = (v: string) => v.replace(/\D/g, '');

/** +7 (938) 438-91-63 style mask. Accepts 8…, 7…, +7… and bare 10-digit numbers. */
export function formatPhone(raw: string): string {
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

export const phoneIsComplete = (v: string) => digits(v).length === 11;

export function buildMessage(l: Lead): string {
  const lines = [
    `Здравствуйте! Хочу записать ребёнка на ${camp.season.toLowerCase()} Ice Hockey Life: ${camp.place}, ${camp.datesHuman}.`,
    '',
    `Родитель: ${l.parent.trim()}`,
    `Телефон: ${l.phone}`,
    `Возраст ребёнка: ${l.age}`,
    `Амплуа: ${l.position}`,
  ];
  if (l.comment?.trim()) lines.push(`Комментарий: ${l.comment.trim()}`);
  return lines.join('\n');
}

export const whatsappLink = (text: string) =>
  `https://wa.me/${contacts.whatsapp}?text=${encodeURIComponent(text)}`;

/** SMS works on every phone and does not depend on messengers being reachable. */
export const smsLink = (text: string) => `sms:${contacts.headCoach.tel}?&body=${encodeURIComponent(text)}`;

declare global {
  interface Window {
    ym?: (id: number, method: string, goal: string) => void;
    __metrikaId?: number;
  }
}

export function initLeadForm(form: HTMLFormElement) {
  const phone = form.elements.namedItem('phone') as HTMLInputElement;
  const done = form.querySelector<HTMLElement>('[data-lead-done]');
  const copyBtn = form.querySelector<HTMLButtonElement>('[data-lead-copy]');
  const preview = form.querySelector<HTMLElement>('[data-lead-preview]');
  const openLink = form.querySelector<HTMLAnchorElement>('[data-lead-open]');
  const smsBtn = form.querySelector<HTMLButtonElement>('[data-lead-sms]');
  const smsLinkEl = form.querySelector<HTMLAnchorElement>('[data-lead-sms-link]');
  let lastMessage = '';

  phone.addEventListener('input', () => {
    const pos = phone.selectionStart === phone.value.length;
    phone.value = phone.value ? formatPhone(phone.value) : '';
    if (pos) phone.setSelectionRange(phone.value.length, phone.value.length);
    phone.setCustomValidity('');
  });
  phone.addEventListener('focus', () => {
    if (!phone.value) phone.value = '+7 ';
  });
  phone.addEventListener('blur', () => {
    if (digits(phone.value).length <= 1) phone.value = '';
  });

  /** validate, build the message and fill the fallback panel; returns null if the form is not valid */
  const prepare = (): string | null => {
    if (!phoneIsComplete(phone.value)) {
      phone.setCustomValidity('Проверьте номер: нужно 10 цифр после +7');
    }
    if (!form.reportValidity()) return null;
    const data = new FormData(form);
    const lead: Lead = {
      parent: String(data.get('parent') ?? ''),
      phone: phone.value,
      age: String(data.get('age') ?? ''),
      position: String(data.get('position') ?? ''),
      comment: String(data.get('comment') ?? ''),
    };
    lastMessage = buildMessage(lead);
    if (preview) preview.textContent = lastMessage;
    if (openLink) openLink.href = whatsappLink(lastMessage);
    if (smsLinkEl) smsLinkEl.href = smsLink(lastMessage);
    done?.removeAttribute('hidden');
    form.classList.add('is-done');
    return lastMessage;
  };

  const goal = (name: string) => {
    if (window.ym && window.__metrikaId) window.ym(window.__metrikaId, 'reachGoal', name);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = prepare();
    if (!text) return;
    goal('lead_whatsapp');
    window.open(whatsappLink(text), '_blank', 'noopener');
  });

  smsBtn?.addEventListener('click', () => {
    const text = prepare();
    if (!text) return;
    goal('lead_sms');
    window.location.href = smsLink(text);
  });

  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(lastMessage);
      copyBtn.dataset.state = 'copied';
      copyBtn.textContent = 'Скопировано';
    } catch {
      copyBtn.textContent = 'Не получилось скопировать';
    }
  });
}
