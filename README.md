# Ice Hockey Life — сайт хоккейного кэмпа

Новый сайт [icehockeylife.ru](https://icehockeylife.ru) — хоккейные сборы для детей в Сириусе (Сочи).
Статический сайт на [Astro](https://astro.build): без админки и базы данных, открывается быстро, хостится где угодно.

Превью: https://alexgoodvinsochi-commits.github.io/icehockeylife/ (закрыто от поисковиков).

## Где что лежит

| Что поменять | Файл |
|---|---|
| Даты, цены, дедлайн ранней цены, часы, подарки, отель | `src/data/camp.ts` |
| Телефоны, WhatsApp, соцсети | `src/data/camp.ts` → `contacts` |
| Тренеры и специалисты (биографии, роли, фото) | `src/data/staff.ts`, фото — `src/assets/staff/<slug>.png` |
| Программа на льду и вне льда | `src/data/program.ts` |
| Вопросы и ответы | `src/data/faq.ts` |
| Отзывы родителей | `src/data/reviews.ts` |
| Города участников | `src/data/cities.ts` |
| Фотографии и подписи к ним | `src/assets/photos/`, `src/data/photos.ts` |

Блоки с датами меняются сами: после 8 ноября ранняя цена скрывается, счётчики дней считаются в браузере.
Для нового сезона достаточно поменять даты и цены в `src/data/camp.ts`.

## Заявки

Форма записи не отправляет данные на сервер: она собирает сообщение (имя родителя, телефон, возраст, амплуа)
и открывает WhatsApp главного тренера с готовым текстом. Номер — `contacts.whatsapp` в `src/data/camp.ts`.

## Запуск и сборка

Нужен Node.js 22.12+.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # готовый сайт в dist/
```

## Публикация

- **Превью** собирается автоматически при каждом пуше в `main` (GitHub Actions → GitHub Pages),
  с `PUBLIC_PREVIEW=1`: страница закрыта от индексации, Яндекс.Метрика отключена.
- **Боевой сайт** на icehockeylife.ru:

  ```bash
  SITE_URL=https://icehockeylife.ru BASE_PATH=/ PUBLIC_PREVIEW=0 PUBLIC_METRIKA=1 npm run build
  ```

  Содержимое `dist/` загрузить на любой хостинг статики (Timeweb, Reg.ru, Beget, Selectel, GitHub Pages
  с собственным доменом) и направить DNS домена на хостинг. Метрика (счётчик 96542568) включается
  только в такой сборке (`PUBLIC_METRIKA=1`); локально и на превью она не подключается.
