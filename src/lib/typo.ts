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

// hyphenated words with at least one letter; up to 16 characters they stay whole, a longer one
// («Петропавловска-Камчатского») may still break at its hyphen rather than run off a 320 px screen
const compound = /[a-zа-яё\d]+(?:-[a-zа-яё\d]+)+/gi;
const glue = (w: string) => (w.length <= 16 && /[a-zа-яё]/i.test(w) ? w.replace(/-/g, '-\u2060') : w);

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
      .replace(/Ice Hockey Life/g, 'Ice\u00a0Hockey\u00a0Life')
      // short prepositions Typograf leaves at line ends; a first name stays with the surname
      .replace(/(^|[\s«(])(вне|для|без|при|под|над|про)\s/gi, '$1$2\u00a0')
      .replace(/(^|[\s«(])(Алексей|Анна|Богдан|Валерий|Дмитрий|Егор|Илья|Инна|Максим|Наталья|Никита|Николай|Олег|Павел|Роберт|Ростислав|Рустам|Светлана|Степан|Татьяна)\s(?=[А-ЯЁ])/g, '$1$2\u00a0');
    // no break after the hyphen of «отеле-партнёре», «U-14» or «152-ФЗ», or the dash of «5–6» (U+2060 word joiner: invisible
    // in both faces); web and e-mail addresses keep their exact characters
    out = out
      .split(/(https?:\/\/\S+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/)
      .map((part, i) => (i % 2 ? part : part.replace(compound, glue).replace(/(\d)–(?=\d)/g, '$1–\u2060')))
      .join('');
    cache.set(text, out);
  }
  return out;
}
