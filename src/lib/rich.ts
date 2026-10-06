// Legal texts as HTML: Russian typography, owner-to-fill [placeholders] highlighted, https:// addresses as links.
import { t } from './typo';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Plain text with Russian typography where the camp's phone numbers become tap-to-call links */
export function withPhones(text: string): string {
  return esc(t(text)).replace(/\+7\s(\d{3})\s(\d{3})-(\d{2})-(\d{2})/g, (n, a, b, c, d) => `<a class="nowrap" href="tel:+7${a}${b}${c}${d}">${n}</a>`);
}

export function rich(text: string): string {
  return esc(t(text))
    .replace(/\+7\s\d{3}\s\d{3}-\d{2}-\d{2}/g, (n) => `<span class="nowrap">${n}</span>`)
    .replace(/\[([^\]]+)\]/g, '<mark class="todo" title="Заполняет владелец сайта перед запуском">[$1]</mark>')
    .replace(/https:\/\/[^\s<]*[^\s<.,;:)]/g, (u) => `<a href="${u}" target="_blank" rel="noopener">${u.replace(/^https:\/\//, '')}</a>`);
}
