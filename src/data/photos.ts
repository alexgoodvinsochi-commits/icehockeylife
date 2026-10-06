// Photo catalogue: file name in src/assets/photos → Russian alt text and tags.
// Tags: ice, off (вне льда), coaches, goalies, team, venue, kit, fun.

export type PhotoMeta = { file: string; alt: string; tags: string[] };

export const photos: PhotoMeta[] = [
  { file: 'skater-with-puck', alt: 'Юный хоккеист в форме Ice Hockey Life набирает скорость с шайбой', tags: ['ice'] },
  { file: 'smiling-boy-closeup', alt: 'Улыбающийся мальчик в шлеме и джерси с эмблемой Ice Hockey Life', tags: ['ice', 'fun'] },
  { file: 'wide-stance-boards', alt: 'Хоккеист в широкой стойке ведёт шайбу вдоль борта', tags: ['ice'] },
  { file: 'two-kids-skating', alt: 'Двое детей отрабатывают катание с клюшкой', tags: ['ice'] },
  { file: 'huddle-coaches', alt: 'Тренеры в жилетах Ice Hockey Life собрали группу на льду', tags: ['ice', 'coaches'] },
  { file: 'two-kids-battle', alt: 'Борьба за шайбу у борта', tags: ['ice'] },
  { file: 'shot-on-goalie', alt: 'Бросок по воротам на тренировке', tags: ['ice', 'goalies'] },
  { file: 'team-photo-arena', alt: 'Общее фото участников и тренеров на льду арены в Сириусе', tags: ['team', 'venue'] },
  { file: 'group-puck-battle', alt: 'Группа отрабатывает игровое упражнение у ворот', tags: ['ice'] },
  { file: 'goalies-net', alt: 'Вратари в полной экипировке у ворот', tags: ['ice', 'goalies'] },
  { file: 'ball-game-indoor', alt: 'Спортивные игры вне льда', tags: ['off', 'fun'] },
  { file: 'stickhandling-office', alt: 'Отработка владения клюшкой вне льда', tags: ['off'] },
  { file: 'boy-red-jersey', alt: 'Мальчик в красной форме Ice Hockey Life с клюшкой', tags: ['off', 'kit'] },
  { file: 'hands-up-game', alt: 'Дети тянут руки вверх в игре с мячом', tags: ['off', 'fun'] },
  { file: 'shooting-office', alt: 'Броски по воротам вне льда', tags: ['off'] },
  { file: 'psychologist-kids', alt: 'Психолог сборов разговаривает с детьми в раздевалке', tags: ['off', 'coaches'] },
  { file: 'goalie-butterfly', alt: 'Вратарь в стойке «бабочка» в воротах', tags: ['ice', 'goalies'] },
  { file: 'stretching-outdoor', alt: 'Растяжка на ковриках на открытом воздухе', tags: ['off'] },
  { file: 'coach-with-goalie', alt: 'Тренер вратарей и юный вратарь на тренировке', tags: ['ice', 'goalies', 'coaches'] },
  { file: 'tps-station', alt: 'Тренажёр для бросков в бросковой зоне', tags: ['off'] },
  { file: 'video-analysis', alt: 'Видеоанализ: дети смотрят разбор игры на большом экране', tags: ['off'] },
  { file: 'two-kids-smiling', alt: 'Двое улыбающихся хоккеистов в шлемах', tags: ['ice', 'fun'] },
  { file: 'gymnastics-bridge', alt: 'Гимнастика: упражнение «мостик» на коврике', tags: ['off'] },
  { file: 'coach-teaching', alt: 'Тренер показывает упражнение ребёнку на льду', tags: ['ice', 'coaches'] },
  { file: 'locker-room', alt: 'Раздевалка команды', tags: ['venue', 'kit'] },
  { file: 'workout-mountains', alt: 'ОФП на открытом воздухе на фоне гор и Олимпийского парка', tags: ['off', 'venue'] },
  { file: 'coaches-at-arena', alt: 'Тренерский штаб Ice Hockey Life у ледовой арены в Сириусе', tags: ['coaches', 'venue'] },
  { file: 'coaches-lineup-ice', alt: 'Тренеры Ice Hockey Life выстроились на льду арены', tags: ['coaches', 'venue'] },
  { file: 'lockers-jerseys', alt: 'Подарки участникам в шкафчиках: фирменные джерси, кепки и форма', tags: ['kit'] },
  { file: 'goalies-huddle', alt: 'Тренер вратарей разбирает упражнение с вратарями', tags: ['ice', 'goalies', 'coaches'] },
  { file: 'team-at-arena', alt: 'Участники сборов в фирменной форме у ледовой арены в Сириусе', tags: ['team', 'venue'] },
  { file: 'coach-tracksuit', alt: 'Тренер Ice Hockey Life с клюшкой на льду', tags: ['coaches'] },
  { file: 'mfr-roller', alt: 'Тренер по растяжке показывает упражнение с роллом (МФР)', tags: ['off', 'coaches'] },
  { file: 'kids-at-table', alt: 'Перерыв между тренировками', tags: ['off', 'fun'] },
  { file: 'little-skaters', alt: 'Самые маленькие участники на льду', tags: ['ice'] },
  { file: 'two-goalies', alt: 'Двое вратарей улыбаются после тренировки', tags: ['goalies', 'fun'] },
  { file: 'skater-vertical', alt: 'Хоккеист в движении', tags: ['ice'] },
  { file: 'group-skating-vertical', alt: 'Группа катится за шайбой', tags: ['ice'] },
  { file: 'tps-shooting', alt: 'Отработка броска на тренажёре', tags: ['off'] },
  { file: 'goalie-stance', alt: 'Вратарь в стойке в воротах', tags: ['ice', 'goalies'] },
];

export const photoMeta = Object.fromEntries(photos.map((p) => [p.file, p]));
