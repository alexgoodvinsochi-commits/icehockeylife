// Facts about the camp. Sources: icehockeylife.ru (Tilda, Sep 2026) and the organizers' announcement
// of the winter 2027 camp. Nothing here is invented — if a fact is unknown, it is not on the site.

export const camp = {
  brand: 'Ice Hockey Life',
  brandFull: 'Ice Hockey Life — Camp by Maxim Kreydikov',
  slogan: 'Твои победы — наша работа',
  sloganVideo: 'Заряжаем на успех',

  season: 'Зимние сборы',
  // ISO dates in Moscow time; used for the countdowns and JSON-LD
  start: '2027-01-04T09:00:00+03:00',
  end: '2027-01-10T20:00:00+03:00',
  datesHuman: '4–10 января 2027',
  city: 'Сочи',
  place: 'Сириус',
  arena: 'Ледовый дворец «Большой»',
  arenaShort: 'ЛД «Большой»',

  hoursIce: 9,
  hoursOffIce: 16,
  groupSize: '5–6',
  summerHoursIce: 16,
  summerHoursOffIce: 25,

  price: {
    early: 43680,
    regular: 48860,
    // early price: first 15 participants who book before 8 November
    earlyUntil: '2026-11-08T23:59:59+03:00',
    earlyUntilHuman: '8 ноября',
    earlySeats: 15,
    covers: 'Стоимость — за тренировки',
    installments: true,
    goalieDiscount: true,
  },

  gifts: ['Форма для ОФП', 'Фирменные джерси', 'Шапки', 'Подарки от IceHockeyLife'],

  hotel: {
    name: 'Сочи Парк Отель',
    note: 'Проживание и питание в стоимость не входят. Номера в отеле-партнёре — по специальной цене, её назовёт координатор.',
  },
} as const;

export const contacts = {
  coordinator: { name: 'Олег', role: 'координатор лагеря', phone: '+7 938 457-89-82', tel: '+79384578982' },
  headCoach: { name: 'Максим Сергеевич', role: 'главный тренер', phone: '+7 938 438-91-63', tel: '+79384389163' },
  whatsapp: '79384389163',
  telegram: 'https://t.me/icehockeylife',
  vk: 'https://vk.com/icehockeyliferu',
  instagram: 'https://instagram.com/icehockeylife.ru',
  instagramHandle: '@icehockeylife.ru',
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
