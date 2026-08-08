# Project State

Последнее обновление: 2026-08-08.

## Текущий статус

Этапы 0–4 из `plans/main-plan.md` завершены. Следующий этап — **этап 5: первый настоящий rendering pipeline**.

## Что уже сделано

- Зафиксированы математические соглашения в `CONVENTIONS.md`:
  - row vectors (`vector × matrix`);
  - преобразования применяются слева направо;
  - world Y направлен вверх, screen Y — вниз;
  - сравнение дробных значений выполняется с `EPSILON`.
- Настроены TypeScript, Vite, Jest и Prettier.
- Команда разработки: `npm run dev`.
- Проверка типов и production-сборка: `npm run build`.
- Тесты: `npm test -- --runInBand`.
- Создан базовый цикл `update → render → requestAnimationFrame`.
- Создан простой Canvas renderer с очисткой и рисованием цветных линий, точек и текста.
- Реализовано преобразование математического `Vec2` в `ScreenPoint` без Canvas transforms.
- Реализован неизменяемый `Vec2` с операциями:
  - `add`;
  - `subtract`;
  - `multiplyScalar`;
  - `negate`;
  - `lengthSquared`;
  - `length`;
  - `normalize` (нулевой вектор выбрасывает ошибку);
  - `dot`;
  - `perpendicular`;
  - `equalsApprox`;
  - `distanceTo`;
  - `projectOnto`;
  - `parallelComponent`;
  - `perpendicularComponent`.
- Написаны тесты `Vec2`.
- Реализован неизменяемый `Mat2`:
  - `identity`;
  - преобразование `Vec2`;
  - умножение матриц и композиция слева направо;
  - rotation;
  - uniform и non-uniform scale;
  - shear;
  - reflection;
  - projection;
  - scale вдоль произвольной оси;
  - transpose;
  - determinant;
  - inverse с ошибкой для singular matrix.
- Реализован неизменяемый `Mat3` с homogeneous coordinates:
  - `identity`;
  - умножение матриц и композиция слева направо;
  - translation, rotation и scale;
  - отдельные `transformPoint` (`w = 1`) и `transformDirection` (`w = 0`);
  - встраивание линейного `Mat2`;
  - transpose;
  - determinant;
  - общий inverse через minors, cofactors и adjugate;
  - ошибка для singular matrix;
  - `equalsApprox`.
- Тесты подтверждают:
  - порядок row-vector композиции;
  - совпадение линейных преобразований `Mat2` и `Mat3`;
  - translation меняет point, но не direction;
  - произведение матрицы на inverse даёт identity;
  - повторное преобразование point через inverse возвращает исходную точку.
- На момент завершения этапа 4 проходят 56 тестов, проверка типов и production-сборка.
- Учебные демонстрации разделены по файлам в `src/demos`.
- Демонстрация `Vec2` показывает:
  - серым — ось X;
  - синим — исходный вектор;
  - зелёным — проекцию;
  - красным — перпендикулярную составляющую.
- Демонстрация `Mat2` показывает исходный и преобразованный квадрат, исходный и преобразованный базис и determinant.
- Активная демонстрация `Mat3` показывает, что одинаковый `Vec2` после translation:
  - как point перемещается;
  - как direction остаётся неизменным.

## Важные ограничения проекта

- Не использовать `ctx.translate`, `ctx.rotate`, `ctx.scale`, `ctx.transform` или `ctx.setTransform` для математики движка.
- Canvas получает только готовые screen-space точки.
- Операции над векторами и матрицами не мутируют исходные значения.
- Локальные импорты TypeScript под Vite пишутся без `.js`.

## Следующий шаг

Начать этап 5 маленькими вертикальными шагами:

1. Создать простую polygon geometry: локальные вершины и список рёбер.
2. Хранить локальную геометрию неизменной.
3. Задать объекту собственную `Mat3`.
4. Построить pipeline: локальная вершина → `transformPoint` → `Vec2ToScreenPoint` → Canvas.
5. Нарисовать один квадрат и визуально проверить movement, rotation, scale и reset.
6. Не вводить `Transform2D`, иерархию или камеру раньше следующего этапа.
