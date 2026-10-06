// The training program, regrouped from the site («Почему выбирают нас», FAQ «Что входит в стоимость»)
// and the organizers' announcement. Facts only from those texts and from the staff bios in staff.ts:
// a person is named next to an activity only where their own bio describes that work.

/** people: staff slugs (photo + bio sheet) and names as shown; note: what they are, after the names */
export type Who = { people: { slug: string; name: string }[]; note: string };
export type ProgramItem = { title: string; text?: string; who?: Who };

export const onIce: ProgramItem[] = [
  {
    title: 'Катание',
    text: 'Ставим правильную технику катания, улучшаем координацию на льду, отрабатываем элементы силового и скоростного катания.',
  },
  { title: 'Клюшка', text: 'Дриблинг и владение клюшкой.' },
  { title: 'Игра', text: 'Игровое мышление, тренировки по амплуа и подробный разбор действий на площадке.' },
  {
    title: 'Вратари',
    who: {
      people: [
        { slug: 'krasilnikov', name: 'Алексей Красильников' },
        { slug: 'berestnev', name: 'Алексей Берестнев' },
      ],
      note: 'тренеры вратарей',
    },
  },
];

export const offIce: ProgramItem[] = [
  { title: 'ОФП, СФП и спортивные игры', text: 'Общая и специальная физическая подготовка, игры с мячом.' },
  { title: 'Бросковая зона', text: 'Броски и дриблинг на тренажёре.' },
  {
    title: 'Растяжка и МФР',
    text: 'Гибкость и миофасциальный релиз: снятие напряжения с мышц и фасций, подготовка к нагрузке.',
    who: { people: [{ slug: 'zakharchenko', name: 'Анна Захарченко' }], note: 'тренер по растяжке, ОФП, СФП и реабилитации после травм' },
  },
  {
    title: 'Гимнастика',
    who: { people: [{ slug: 'ivanova', name: 'Светлана Иванова' }], note: 'мастер спорта по художественной гимнастике' },
  },
  { title: 'Координация и баланс', text: 'Скорость, координация, баланс и ловкость — с профильным тренером.' },
  {
    title: 'Правильное движение',
    text: 'Осанка, стопы, суставы, дыхание.',
    who: {
      people: [
        { slug: 'mayer', name: 'Наталья Майер' },
        { slug: 'deshkovich', name: 'Инна Дешкович' },
      ],
      note: 'специалисты по движению',
    },
  },
  {
    title: 'Занятия с психологом',
    who: { people: [{ slug: 'ostrikova', name: 'Татьяна Острикова' }], note: 'спортивный психолог' },
  },
  { title: 'Видеоанализ', text: 'Разбираем видео игр и тренировок.' },
];
