// FAQ from icehockeylife.ru and the organizers' announcement (price covers training only; goalie discount
// and installments). Punctuation tidied, meaning kept. Each fact has one home on the page: answers that the
// price or programme sections already give in full point there instead of repeating them.
// Numbers and dates come from camp.ts; answers about the early price expire with it (until / from).

import { camp, contacts, rub, regularFrom } from './camp';

export type Faq = {
  q: string;
  a: string[];
  link?: { href: string; label: string };
  /** shown only before / after this moment (ISO), like [data-until] / [data-from] elsewhere */
  until?: string;
  from?: string;
};

const { price } = camp;

export const faq: Faq[] = [
  {
    q: 'Можно ли оставить ребёнка на тренировке и уйти?',
    a: [
      'Да, на время тренировок. Сборы без проживания: ребёнок живёт с вами, а на тренировки его можно привезти к началу и забрать по окончании. Например, привезти до обеда, забрать на обед и привезти на вторую часть тренировок.',
      'Либо привезти ребёнка на утреннюю тренировку, оставить на дневное пребывание с питанием и забрать вечером после всех тренировок. Дневное пребывание оплачивается отдельно.',
    ],
    link: { href: '#roditelyam', label: 'Как устроен день в Сириусе' },
  },
  {
    q: 'Для какого возраста сборы?',
    a: [
      `Группы собираем по возрасту и уровню подготовки. Подойдут ли сборы вашему ребёнку, подскажет главный тренер Максим Сергеевич: ${contacts.headCoach.phone}.`,
    ],
  },
  {
    q: 'Что входит в стоимость?',
    a: [
      `Только тренировки: ${camp.hoursIce} часов на льду и ${camp.hoursOffIce} часов вне льда. Каждому участнику — форма для ОФП, фирменные джерси, шапка и подарки от Ice Hockey Life.`,
    ],
    link: { href: '#cena', label: 'Цены и что не входит' },
  },
  {
    q: 'Входят ли проживание и питание?',
    a: [
      `Нет. Мы сотрудничаем с отелем «${camp.hotel.name}»: напишите или позвоните координатору — пришлём цены на проживание и питание для участника и его семьи.`,
    ],
  },
  {
    q: 'Сколько человек будет на льду?',
    a: [`Все участники делятся на мини-группы по ${camp.groupSize} человек по уровню и возрасту. За каждой группой закреплён тренер.`],
  },
  {
    q: 'Когда будет расписание?',
    until: camp.overAfter,
    a: [
      `Точное расписание пришлём за 2 недели до сборов. Примерный распорядок дня пришлём уже сейчас — спросите координатора Олега: ${contacts.coordinator.phone}.`,
    ],
  },
  {
    q: 'Есть ли скидки и рассрочка?',
    a: [
      `Для первых ${price.earlySeats} участников, которые забронируют место до ${price.earlyUntilHuman} включительно, действует специальная цена — ${rub(price.early)} вместо ${rub(price.regular)}. Вратарям — скидка, оплатить можно в рассрочку: размер скидки и условия рассрочки назовёт координатор.`,
    ],
    until: price.earlyUntil,
  },
  {
    q: 'Есть ли скидки и рассрочка?',
    a: ['Вратарям — скидка, оплатить можно в рассрочку: размер скидки и условия рассрочки назовёт координатор.'],
    from: regularFrom,
  },
];
