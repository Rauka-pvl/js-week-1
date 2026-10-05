// src/services/itemService.js
// Сервисный слой: все операции с данными.
// Функции НИЧЕГО не печатают в консоль — они возвращают результат,
// а выводом для пользователя занимается index.js.

import { delay, generateId } from "../utils/helpers.js";

// Возвращает копию массива всех записей (spread — защита от мутации оригинала)
export const getAllItems = (items) => [...items];

// Возвращает одну запись по id или null, если запись не найдена
export const getItemById = (items, id) =>
  items.find((item) => item.id === id) ?? null;

// Создаёт новую запись.
// Исходный объект data не изменяется: служебные поля добавляются через spread.
export const createItem = (items, data) => {
  const newItem = {
    id: generateId(items), // id генерируется автоматически
    description: "Описание отсутствует", // значение по умолчанию...
    ...data, // ...которое перекрывается полями из data
    createdAt: new Date().toISOString(), // дата создания проставляется всегда
  };
  return newItem;
};

// Удаляет запись по id и возвращает НОВЫЙ массив без неё
export const deleteItem = (items, id) =>
  items.filter((item) => item.id !== id);

// Возвращает записи нужной категории (сравнение без учёта регистра)
export const findByCategory = (items, category) =>
  items.filter(
    ({ category: itemCategory }) =>
      itemCategory.toLowerCase() === category.toLowerCase()
  );

// Считает общую стоимость всех записей через reduce
export const calculateTotalPrice = (items) =>
  items.reduce((total, { price }) => total + price, 0);

// Считает среднюю цену записи
export const calculateAveragePrice = (items) =>
  items.length === 0 ? 0 : Math.round(calculateTotalPrice(items) / items.length);

// Ищет записи по title или description без учёта регистра
export const searchItems = (items, query = "") => {
  const normalizedQuery = query.trim().toLowerCase();
  return items.filter(({ title, description }) =>
    `${title} ${description}`.toLowerCase().includes(normalizedQuery)
  );
};

// Возвращает список названий всех записей (map)
export const getItemTitles = (items) => items.map(({ title }) => title);

// Группирует записи по категориям и считает статистику (reduce + spread + ??)
export const getCategoryStats = (items) =>
  items.reduce((stats, { category, price }) => {
    const current = stats[category] ?? { count: 0, totalPrice: 0 };
    return {
      ...stats,
      [category]: {
        count: current.count + 1,
        totalPrice: current.totalPrice + price,
      },
    };
  }, {});

// Имитирует асинхронную загрузку данных «с сервера» (Promise + async/await).
// На следующих неделях здесь будет реальный запрос к MongoDB / REST API.
export const loadItems = async (items, delayMs = 1500) => {
  await delay(delayMs); // имитация сетевой задержки
  if (!Array.isArray(items)) {
    throw new Error("Не удалось загрузить данные: источник данных недоступен");
  }
  return [...items];
};
