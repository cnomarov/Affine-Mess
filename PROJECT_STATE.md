# Project State

Последнее обновление: 2026-08-20.

## Текущий статус

Этапы 0–10 из `plans/main-plan.md` завершены. Следующий этап — **этап 11: debug renderer**.

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
- Реализован `Mesh2D`:
  - хранит только локальные вершины и рёбра;
  - копирует входные массивы и не зависит от их последующих изменений;
  - один экземпляр mesh переиспользуется несколькими объектами;
  - локальные вершины не мутируют при преобразовании.
- Реализован `Node2D`:
  - связывает `Transform2D` и необязательный `Mesh2D`;
  - хранит `parent` и множество `children`;
  - поддерживает добавление и удаление ребёнка;
  - защищает дерево от самодобавления, дубликатов, второго родителя и циклов;
  - рекурсивно вычисляет world matrix в порядке `local × parent world`;
  - выполняет depth-first обход дерева через `traverse`.
- Тесты `Node2D` подтверждают:
  - целостность двусторонних parent-child связей;
  - отсутствие частичных изменений после ошибок;
  - корректность world matrix для корня и цепочки предков;
  - порядок `child local → parent world` при rotation;
  - порядок depth-first обхода.
- Реализован `Camera2D`:
  - `position`;
  - `rotation`;
  - `zoom`;
  - camera world matrix в порядке `rotation → translation`;
  - view matrix как inverse camera world matrix;
  - отдельная zoom matrix;
  - композиция `View × Zoom`.
- Тесты `Camera2D` подтверждают:
  - преобразование camera-local point в world space;
  - преобразование world point в camera space;
  - обратимость `View × Zoom`;
  - корректную работу rotation и zoom.
- Реализовано обратное screen-преобразование `ScreenPointToVec2`:
  - удаляет screen origin;
  - учитывает `pixelsPerUnit`;
  - восстанавливает математическое направление Y вверх;
  - проходит round-trip `Vec2 → screen → Vec2`.
- Реализован полный прямой и обратный coordinate pipeline:
  - `local → world → camera/zoom → screen`;
  - `screen → camera/zoom → world → local`;
  - интеграционный тест восстанавливает исходную child-local point после полного screen round-trip.
- Реализован local-space picking ребёнка:
  - координаты мыши переводятся из Canvas pixels в world space;
  - world point переводится через inverse world matrix в child local space;
  - hover работает для вложенного, повёрнутого и масштабированного node;
  - клик сохраняет выбранное состояние, клик вне объекта снимает выбор.
- На текущий момент проходят 87 тестов, проверка типов и production-сборка.
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
- Pivot-демонстрация показывает вращение геометрии вокруг центра, края, угла и внешней точки.
- Активная hierarchy-демонстрация показывает:
  - цепочку `parent → child → grandchild`;
  - переиспользование одного mesh тремя node;
  - рекурсивные world matrices и обход дерева;
  - независимое вращение parent и child;
  - движение, rotation и zoom камеры;
  - screen-to-world и world-to-local координаты мыши;
  - hover и сохранённый выбор child через local-space picking.
- Управление активной демонстрацией:
  - `Q/E` — rotation parent;
  - `A/D` — rotation child;
  - стрелки — движение камеры;
  - `Z/X` — rotation камеры;
  - `+/-` — zoom;
  - `R` — reset.

## Важные ограничения проекта

- Не использовать `ctx.translate`, `ctx.rotate`, `ctx.scale`, `ctx.transform` или `ctx.setTransform` для математики движка.
- Canvas получает только готовые screen-space точки.
- Операции над векторами и матрицами не мутируют исходные значения.
- Локальные импорты TypeScript под Vite пишутся без `.js`.

## Следующий шаг

Начать этап 11 маленькими вертикальными шагами:

1. Ввести минимальный debug renderer отдельно от обычного renderer.
2. Для выбранного node визуализировать world origin и pivot.
3. Добавить локальные X/Y axes, преобразованные world matrix.
4. Показать local matrix, world matrix и determinant в простом текстовом блоке.
5. Показать mouse world point, mouse local point и восстановленную точку.
6. Пока не строить сложный UI — достаточно линий, точек и текста на Canvas.
