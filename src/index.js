// src/index.js
// Точка входа приложения DataShare CLI.
// Здесь функции сервиса вызываются последовательно,
// а их результаты красиво выводятся в консоль.

import { items as initialItems } from "./data/items.js";
import {
  getAllItems,
  getItemById,
  createItem,
  deleteItem,
  findByCategory,
  calculateTotalPrice,
  calculateAveragePrice,
  searchItems,
  getItemTitles,
  getCategoryStats,
  loadItems,
} from "./services/itemService.js";
import {
  formatItem,
  formatPrice,
  getSeriesName,
  printSection,
  printLines,
} from "./utils/helpers.js";

const main = async () => {
  console.log("=== DataShare CLI — Неделя 1 ===");
  console.log("Предметная область: Книги (вариант 2)");
  console.log("Студент: Аделканов Рауат, группа CS-302(с)");

  try {
    // 1. Асинхронная «загрузка» данных (Promise + async/await)
    printSection("Загрузка данных");
    console.log("Загрузка данных...");
    let items = await loadItems(initialItems, 1500);
    console.log(`Данные успешно загружены. Всего записей: ${items.length}`);

    // 2. Вывод всех записей
    printSection("Все записи");
    printLines(
      ...getAllItems(items).map((item, index) => formatItem(item, index + 1))
    );

    // 3. Поиск записи по id
    printSection("Поиск записи по id = 3");
    const found = getItemById(items, 3);
    console.log(found ? formatItem(found) : "Запись не найдена");
    // optional chaining + nullish coalescing на случай отсутствия записи/поля
    console.log(`Серия найденной книги: ${getSeriesName(found)}`);

    // 4. Фильтрация по категории (filter)
    printSection('Категория: "Фантастика"');
    const sciFiBooks = findByCategory(items, "Фантастика");
    console.log(`Найдено: ${sciFiBooks.length}`);
    printLines(...sciFiBooks.map((item) => formatItem(item)));

    // 5. Поиск по ключевому слову (ищет и в title, и в description)
    printSection('Поиск: "дьявол"');
    const searchResult = searchItems(items, "дьявол");
    console.log(`Найдено: ${searchResult.length}`);
    printLines(...searchResult.map((item) => formatItem(item)));

    // 6. Создание новой записи (spread + служебные поля)
    printSection("Создание новой записи");
    const newItem = createItem(items, {
      title: "Понедельник начинается в субботу",
      description: "Сатирическая повесть о программисте Привалове и НИИЧАВО",
      author: "Аркадий и Борис Стругацкие",
      year: 1965,
      category: "Фантастика",
      price: 3100,
    });
    items = [...items, newItem];
    console.log(`Создана новая запись: ${formatItem(newItem)}`);

    // 7. Удаление записи по id
    printSection("Удаление записи");
    const idToDelete = 2;
    const { title: deletedTitle } =
      getItemById(items, idToDelete) ?? { title: "неизвестная книга" };
    items = deleteItem(items, idToDelete);
    console.log(`Удалена запись с id: ${idToDelete} («${deletedTitle}»)`);

    // 8. Общая статистика (reduce)
    printSection("Статистика");
    console.log(`Количество записей: ${items.length}`);
    console.log(`Общая стоимость: ${formatPrice(calculateTotalPrice(items))}`);
    console.log(`Средняя цена: ${formatPrice(calculateAveragePrice(items))}`);

    // 9. Список названий (map)
    printSection("Список названий");
    printLines(...getItemTitles(items));

    // 10. Статистика по категориям (reduce + destructuring в цикле)
    printSection("Статистика по категориям");
    const stats = getCategoryStats(items);
    for (const [category, { count, totalPrice }] of Object.entries(stats)) {
      console.log(
        `${category}: ${count} шт., на сумму ${formatPrice(totalPrice)}`
      );
    }

    // 11. Демонстрация обработки ошибки (try/catch при асинхронной операции)
    printSection("Проверка обработки ошибок");
    try {
      await loadItems(null, 500); // специально передаём некорректные данные
    } catch (error) {
      console.log(`Ошибка обработана корректно: ${error.message}`);
    }

    printSection("Работа программы завершена");
  } catch (error) {
    console.error(`Критическая ошибка: ${error.message}`);
    process.exitCode = 1;
  }
};

main();
