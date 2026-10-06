// Facts about the camp. Sources: icehockeylife.ru (Tilda, Sep 2026) and the organizers' announcement
// of the winter 2027 camp. Nothing here is invented — if a fact is unknown, it is not on the site.

export const camp = {
  brand: 'Ice Hockey Life',
  brandFull: 'Ice Hockey Life — Camp by Maxim Kreydikov',
  slogan: 'Твои победы — наша работа',
  sloganVideo: 'Заряжаем на успех',

  season: 'Зимние сборы',
  // days only: the sources give no start or finish times (JSON-LD, the SMS text)
  start: '2027-01-04',
  end: '2027-01-10',
  /** after this moment the page stops taking sign-ups for this camp: the end of the last day, Moscow time */
  overAfter: '2027-01-10T23:59:59+03:00',
  daysRange: '4–10',
  monthYear: 'января 2027',
  datesHuman: '4–10 января 2027',
  days: 'Семь дней',
  city: 'Сочи',
  place: 'Сириус',
  // the venue's own name (ГБУ КК «Дворец спорта «Большой»»); «ЛД «Большой»» is the announcement's short form
  arena: 'Дворец спорта «Большой»',
  arenaShort: 'ЛД «Большой»',

  hoursIce: 9,
  hoursOffIce: 16,
  groupSize: '5–6',

  price: {
    early: 43680,
    regular: 48860,
    // early price: the first 15 participants who book by 8 November inclusive (Moscow time)
    earlyUntil: '2026-11-08T23:59:59+03:00',
    earlyUntilHuman: '8 ноября',
    earlyYear: 2026,
    regularFromHuman: '9 ноября',
    earlySeats: 15,
    covers: 'Стоимость — за тренировки',
    installments: true,
    goalieDiscount: true,
  },

  gifts: ['Форма для ОФП', 'Фирменные джерси', 'Шапка', 'Подарки от Ice Hockey Life'],

  hotel: {
    name: 'Сочи Парк Отель',
    note: 'Проживание и питание в стоимость не входят. Номера в отеле-партнёре — по специальной цене, её назовёт координатор.',
  },
} as const;

/** «43 680 ₽» with no-break spaces, so a price never splits across lines */
export const rub = (n: number) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')}\u00a0₽`;

/** the moment the regular price starts: one second after the early price ends */
export const regularFrom = new Date(Date.parse(camp.price.earlyUntil) + 1000).toISOString();

export const contacts = {
  // remit: whom to call about what, the same everywhere the two numbers appear; dat: «позвонить Олегу»
  coordinator: { name: 'Олег', dat: 'Олегу', role: 'координатор сборов', remit: 'запись по телефону, оплата, проживание', phone: '+7 938 457-89-82', tel: '+79384578982' },
  headCoach: { name: 'Максим Сергеевич', dat: 'Максиму Сергеевичу', role: 'главный тренер', remit: 'заявки с сайта, программа, возраст и уровень', phone: '+7 938 438-91-63', tel: '+79384389163' },
  whatsapp: '79384389163',
  telegram: 'https://t.me/icehockeylife',
  vk: 'https://vk.com/icehockeyliferu',
} as const;

export const video = {
  title: 'Один день из жизни нашего кэмпа',
  oid: '-219304286',
  id: '456239181',
  page: 'https://vkvideo.ru/video-219304286_456239181',
} as const;

export const partners = [
  { name: 'Vitokin', note: 'Официальный партнёр' },
  { name: 'One Timer', note: 'Официальный партнёр' },
] as const;

export const metrikaId = 96542568;
