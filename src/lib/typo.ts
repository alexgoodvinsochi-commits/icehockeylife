// Russian typography for every text that goes on the page: non-breaking spaces after short
// prepositions and inside numbers, «ёлочки», proper dashes. Runs at build time only.
import Typograf from 'typograf';

const tp = new Typograf({ locale: ['ru', 'en-US'] });
// numbers stick to their units (9 часов); our own number formats and phone numbers stay as written
tp.enableRule('common/nbsp/afterNumber');
tp.disableRule('common/number/digitGrouping');
tp.disableRule('ru/other/phone-number');
// «ознакомлен(а)», «сам(а)» in the legal texts must keep the bracket glued to the word
tp.disableRule('common/space/beforeBracket');

const cache = new Map<string, string>();

export function t(text: string): string {
  if (!text) return text;
  let out = cache.get(text);
  if (out === undefined) {
    // a day and its month stay on one line («5 декабря»), Typograf only glues short words
    out = tp.execute(text).replace(/(\d)\s(января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)/g, '$1\u00a0$2')
      // «43 680 ₽» and «5–6 человек» stay whole
      .replace(/(\d)\s(\d{3})\s?₽/g, '$1\u00a0$2\u00a0₽')
      .replace(/(\d+–\d+)\s(?=[а-яё])/g, '$1\u00a0')
      // the brand never splits across lines
      .replace(/Ice Hockey Life/g, 'Ice\u00a0Hockey\u00a0Life');
    cache.set(text, out);
  }
  return out;
}
