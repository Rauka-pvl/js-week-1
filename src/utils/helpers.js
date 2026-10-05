// src/utils/helpers.js
// Вспомогательные функции: форматирование, вывод и генерация id.
// Здесь нет бизнес-логики данных — только «технические» утилиты.

// Форматирует число как цену: 2450000 -> "2 450 000 ₸"
export const formatPrice = (price) => `${price.toLocaleString("ru-RU")} ₸`;

// Форматирует одну запись для вывода в консоль.
// Используются: destructuring, default parameter, nullish coalescing,
// optional chaining и template literals.
export const formatItem = (item, index = null) => {
  const { id, title, author, year, category, price } = item;
  const prefix = index ?? id; // если index не передан — показываем id
  const series = item.series?.name ? `, серия «${item.series.name}»` : "";
  return `${prefix}. «${title}» — ${author}, ${year} г. [${category}]${series} — ${formatPrice(price)}`;
};

// Безопасно возвращает название серии книги.
// optional chaining (?.) не даст упасть, если item или series отсутствуют,
// а nullish coalescing (??) подставит значение по умолчанию.
export const getSeriesName = (item) => item?.series?.name ?? "вне серии";

// Печатает заголовок секции в консоли
export const printSection = (title) => {
  console.log(`\n=== ${title} ===`);
};

// Печатает произвольное количество строк (rest-параметры)
export const printLines = (...lines) => {
  lines.forEach((line) => console.log(line));
};

// Promise-обёртка над setTimeout — «пауза» для асинхронных функций
export const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// Генерирует id для новой записи: максимальный существующий id + 1.
// Такой способ не даёт дубликатов даже после удаления записей
// (в отличие от варианта items.length + 1).
export const generateId = (items) =>
  items.length === 0 ? 1 : Math.max(...items.map(({ id }) => id)) + 1;
