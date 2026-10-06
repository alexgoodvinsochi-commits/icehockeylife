// Cities of past participants — the banner «География городов участников лагеря» on icehockeylife.ru (35 cities).
// Country is given only where the banner gives it. Coordinates: OpenStreetMap Nominatim; km = great-circle
// distance to ЛД «Большой» (Sirius), rounded.

export type City = { name: string; country?: string; lat: number; lon: number; km: number };

export const cities: City[] = [
  { name: 'Сочи', lat: 43.5855, lon: 39.7231, km: 26 },
  { name: 'Кореновск', lat: 45.4636, lon: 39.4488, km: 231 },
  { name: 'Нижние Серги', lat: 56.6619, lon: 59.3, km: 2006 },
  { name: 'Северодвинск', lat: 64.5634, lon: 39.8238, km: 2352 },
  { name: 'Тарту', country: 'Эстония', lat: 58.378, lon: 26.729, km: 1897 },
  { name: 'Горячий Ключ', lat: 44.6343, lon: 39.1364, km: 150 },
  { name: 'Когалым', lat: 62.268, lon: 74.4889, km: 3061 },
  { name: 'Новополоцк', country: 'Беларусь', lat: 55.5349, lon: 28.6452, km: 1571 },
  { name: 'Краснодар', lat: 45.0352, lon: 38.9772, km: 196 },
  { name: 'Дубай', country: 'ОАЭ', lat: 25.2647, lon: 55.2924, km: 2452 },
  { name: 'Санкт-Петербург', lat: 59.9607, lon: 30.1587, km: 1955 },
  { name: 'Майкоп', lat: 44.6062, lon: 40.1041, km: 133 },
  { name: 'Москва', lat: 55.6256, lon: 37.6064, km: 1368 },
  { name: 'Уфа', lat: 54.7261, lon: 55.9475, km: 1707 },
  { name: 'Магнитогорск', lat: 53.407, lon: 58.9811, km: 1781 },
  { name: 'Красногорск', lat: 55.8205, lon: 37.3197, km: 1392 },
  { name: 'Выселки', lat: 45.5806, lon: 39.6574, km: 242 },
  { name: 'Ейск', lat: 46.7112, lon: 38.2748, km: 389 },
  { name: 'Симферополь', lat: 44.9521, lon: 34.1025, km: 496 },
  { name: 'Омск', lat: 54.9914, lon: 73.3715, km: 2712 },
  { name: 'Ханты-Мансийск', lat: 61.0035, lon: 69.019, km: 2741 },
  { name: 'Владикавказ', lat: 43.0246, lon: 44.6821, km: 386 },
  { name: 'Тобольск', lat: 58.1998, lon: 68.2513, km: 2547 },
  { name: 'Альметьевск', lat: 54.9005, lon: 52.2964, km: 1556 },
  { name: 'Астрахань', lat: 46.3498, lon: 48.0326, km: 715 },
  { name: 'Лиски', lat: 50.9874, lon: 39.4972, km: 843 },
  { name: 'Волгоград', lat: 48.7082, lon: 44.5153, km: 686 },
  { name: 'Челябинск', lat: 55.1598, lon: 61.4026, km: 2017 },
  { name: 'Минск', country: 'Беларусь', lat: 53.9025, lon: 27.5618, km: 1475 },
  { name: 'Нижний Новгород', lat: 56.3265, lon: 44.0051, km: 1464 },
  { name: 'Екатеринбург', lat: 56.8382, lon: 60.6008, km: 2081 },
  { name: 'Барнаул', lat: 53.3475, lon: 83.7788, km: 3359 },
  { name: 'Новосибирск', lat: 55.0288, lon: 82.9227, km: 3313 },
  { name: 'Набережные Челны', lat: 55.742, lon: 52.3992, km: 1633 },
  { name: 'Петропавловск-Камчатский', lat: 53.02, lon: 158.6471, km: 7803 },
];

export const countries = 1 + new Set(cities.map((c) => c.country).filter(Boolean)).size;
export const farthest = [...cities].sort((a, b) => b.km - a.km)[0];
