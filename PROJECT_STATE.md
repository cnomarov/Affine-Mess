# Project State

Последнее обновление: 2026-08-10.

## Текущий статус

Этапы 0–6 из `plans/main-plan.md` завершены. Следующий этап — **этап 7: отделение геометрии от объекта**.

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
- Реализован первый polygon rendering pipeline:
  - локальные вершины и рёбра квадрата хранятся отдельно от преобразованных точек;
  - каждый кадр локальные вершины проходят через `Mat3.transformPoint`;
  - world-space точки преобразуются в screen-space без Canvas transforms;
  - поддерживаются movement, rotation, proportional scale и reset;
  - отдельные квадраты визуально показывают различие `scale → rotation` и `rotation → scale`.
- Реализован `Transform2D`:
  - `position`;
  - `rotation`;
  - non-uniform `scale`;
  - локальный `pivot`;
  - вычисление local matrix в порядке `translation(-pivot) → scale → rotation → translation(position)`;
  - `position` означает положение pivot в пространстве родителя.
- Тесты `Transform2D` подтверждают:
  - обычный порядок `scale → rotation → translation` при нулевом pivot;
  - применение преобразований слева направо;
  - pivot после scale и rotation оказывается точно в `position`.
- На момент завершения этапа 6 проходят 59 тестов и проверка типов.
- Учебные демонстрации разделены по файлам в `src/demos`.
- Демонстрация `Vec2` показывает:
  - серым — ось X;
  - синим — исходный вектор;
  - зелёным — проекцию;
  - красным — перпендикулярную составляющую.
- Демонстрация `Mat2` показывает исходный и преобразованный квадрат, исходный и преобразованный базис и determinant.
- Демонстрация `Mat3` показывает, что одинаковый `Vec2` после translation:
  - как point перемещается;
  - как direction остаётся неизменным.
- Демонстрация polygon pipeline показывает ручное преобразование локальной геометрии и разницу порядка матриц.
- Активная pivot-демонстрация показывает вращение геометрии вокруг:
  - центра;
  - середины края;
  - угла;
  - внешней точки.
- В pivot-демонстрации `Q/E` управляют вращением, `R` выполняет reset, а клавиши `1–4` выбирают положение pivot.

## Важные ограничения проекта

- Не использовать `ctx.translate`, `ctx.rotate`, `ctx.scale`, `ctx.transform` или `ctx.setTransform` для математики движка.
- Canvas получает только готовые screen-space точки.
- Операции над векторами и матрицами не мутируют исходные значения.
- Локальные импорты TypeScript под Vite пишутся без `.js`.

## Следующий шаг

Начать этап 7 маленькими вертикальными шагами:

1. Ввести `Mesh2D`, содержащий только локальные вершины и рёбра.
2. Перенести геометрию квадрата из demo в экземпляр `Mesh2D` без изменения rendering pipeline.
3. Убедиться, что один и тот же mesh можно использовать несколькими объектами без копирования массива вершин.
4. Ввести минимальный `Node2D`, связывающий `Transform2D` и необязательный `Mesh2D`.
5. Пока не добавлять parent-child hierarchy, world matrix, кэширование или камеру — они относятся к следующим этапам.
