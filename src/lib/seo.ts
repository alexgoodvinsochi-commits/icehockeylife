import { camp, contacts } from '../data/camp';

export const isPreview = import.meta.env.PUBLIC_PREVIEW === '1';
/** Yandex.Metrica runs only in an explicit production build (PUBLIC_METRIKA=1), never locally or on the preview. */
export const metrikaOn = import.meta.env.PUBLIC_METRIKA === '1' && !isPreview;

export const seo = {
  title: `Хоккейные сборы для детей в Сириусе, ${camp.datesHuman} — Ice Hockey Life`,
  description:
    'Зимние хоккейные сборы в Сириусе (Сочи) на льду ЛД «Большой»: 9 часов льда и 16 часов вне льда, группы по 5–6 детей, ' +
    '12 тренеров, психолог, гимнастика и растяжка. Ранняя цена 43 680 ₽ — первым 15 участникам до 8 ноября включительно.',
  keywords:
    'хоккейные сборы, детские хоккейные сборы, хоккейные сборы Сириус, хоккейные сборы Сочи, зимние хоккейные сборы 2027, хоккейный кэмп, сборы для вратарей',
};

/** schema.org markup: the camp as a SportsEvent with two price offers, organised by the camp. */
export function eventJsonLd(siteUrl: string, image: string) {
  const offers = [
    {
      '@type': 'Offer',
      name: 'Ранняя цена — первым 15 участникам до 8 ноября включительно',
      price: camp.price.early,
      priceCurrency: 'RUB',
      validThrough: camp.price.earlyUntil,
      availability: 'https://schema.org/LimitedAvailability',
      url: `${siteUrl}#zapis`,
    },
    {
      '@type': 'Offer',
      name: 'Стоимость с 9 ноября',
      price: camp.price.regular,
      priceCurrency: 'RUB',
      validFrom: '2026-11-09T00:00:00+03:00',
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
