// Russian typography for every text that goes on the page: non-breaking spaces after short
// prepositions and inside numbers, «ёлочки», proper dashes. Runs at build time only.
import Typograf from 'typograf';

const tp = new Typograf({ locale: ['ru', 'en-US'] });
// numbers stick to their units (9 часов); our own number formats and phone numbers stay as written
tp.enableRule('common/nbsp/afterNumber');
tp.disableRule('common/number/digitGrouping');
tp.disableRule('ru/other/phone-number');

const cache = new Map<string, string>();

export function t(text: string): string {
  if (!text) return text;
  let out = cache.get(text);
  if (out === undefined) {
    out = tp.execute(text);
    cache.set(text, out);
  }
  return out;
}
