import { camp, contacts, regularFrom } from '../data/camp';

/** Closed by default: only an explicit PUBLIC_PREVIEW=0 build is the real, indexable site (see README). */
export const isPreview = import.meta.env.PUBLIC_PREVIEW !== '0';
/** Yandex.Metrica runs only in an explicit production build (PUBLIC_METRIKA=1), never locally or on the preview. */
export const metrikaOn = import.meta.env.PUBLIC_METRIKA === '1' && !isPreview;

/** The site root with a trailing slash, whatever BASE_PATH looks like (`/icehockeylife` or `/icehockeylife/`) */
export const siteBase = (site: URL | undefined) => new URL(import.meta.env.BASE_URL.replace(/\/?$/, '/'), site);

export const seo = {
  title: `Хоккейные сборы для детей в Сириусе, ${camp.datesHuman} — Ice Hockey Life`,
  // no price here: the description is baked into the page and the share card, and the early price expires
  description:
    `Зимние хоккейные сборы в Сириусе (Сочи) на льду ${camp.arenaShort}: ${camp.hoursIce} часов льда и ${camp.hoursOffIce} часов вне льда, ` +
    // no coach count: the January line-up is still to be confirmed
    `группы по ${camp.groupSize} детей, тренеры вратарей, психолог, гимнастика и растяжка.`,
  keywords:
    'хоккейные сборы, детские хоккейные сборы, хоккейные сборы Сириус, хоккейные сборы Сочи, зимние хоккейные сборы 2027, хоккейный кэмп, сборы для вратарей',
};

/** schema.org markup: the camp as a SportsEvent with two price offers, organised by the camp. */
export function eventJsonLd(siteUrl: string, image: string) {
  const offers = [
    {
      '@type': 'Offer',
      name: `Ранняя цена — первым ${camp.price.earlySeats} участникам до ${camp.price.earlyUntilHuman} включительно`,
      price: camp.price.early,
      priceCurrency: 'RUB',
      validThrough: camp.price.earlyUntil,
      availability: 'https://schema.org/LimitedAvailability',
      url: `${siteUrl}#zapis`,
    },
    {
      '@type': 'Offer',
      name: `Стоимость с ${camp.price.regularFromHuman}`,
      price: camp.price.regular,
      priceCurrency: 'RUB',
      validFrom: regularFrom,
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}#zapis`,
    },
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${camp.season} Ice Hockey Life — хоккейные сборы для детей`,
    description: seo.description,
    sport: 'Хоккей с шайбой',
    startDate: camp.start,
    endDate: camp.end,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: [image],
    location: {
      '@type': 'Place',
      name: camp.arena,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Олимпийский проспект, 7',
        addressLocality: 'Сириус',
        addressRegion: 'Краснодарский край',
        addressCountry: 'RU',
      },
    },
    organizer: {
      '@type': 'SportsOrganization',
      name: 'Ice Hockey Life',
      url: siteUrl,
      telephone: contacts.headCoach.tel,
      sameAs: [contacts.telegram, contacts.vk],
    },
    offers,
  };
}
