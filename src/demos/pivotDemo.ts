import { Vec2 } from '../math/Vec2';
import { drawLine, drawPoint, drawText } from '../renderer';
import { Transform2D } from '../scene/Transform2D';
import type { ScreenPoint } from '../types';
import { Vec2ToScreenPoint } from '../utils/Vec2ToScreenPoint';

const doorVertices: Vec2[] = [
  new Vec2(-1, -1),
  new Vec2(1, -1),
  new Vec2(1, 1),
  new Vec2(-1, 1),
];

const doorEdges: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
];

const screenOrigin: ScreenPoint = {
  x: 350,
  y: 250,
};

const pixelsPerUnit = 70;
const initialRotation = 0;

const doorTransform = new Transform2D(
  new Vec2(0, 0),
  initialRotation,
  new Vec2(1, 1),
  new Vec2(-1, 0)
);

window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'q') {
    doorTransform.rotation += Math.PI / 36;
  }

  if (event.key.toLowerCase() === 'e') {
    doorTransform.rotation -= Math.PI / 36;
  }

  if (event.key.toLowerCase() === 'r') {
    doorTransform.rotation = initialRotation;
    doorTransform.pivot = new Vec2(-1, 0);
  }

  if (event.key === '1') {
    doorTransform.pivot = new Vec2(0, 0);
  }

  if (event.key === '2') {
    doorTransform.pivot = new Vec2(-1, 0);
  }

  if (event.key === '3') {
    doorTransform.pivot = new Vec2(-1, -1);
  }

  if (event.key === '4') {
    doorTransform.pivot = new Vec2(-2, 0);
  }
});

export function renderPivotDemo(ctx: CanvasRenderingContext2D): void {
  const localMatrix = doorTransform.getLocalMatrix();
  const transformedVertices = doorVertices.map((vertex) => {
    return localMatrix.transformPoint(vertex);
  });

  for (const [fromIndex, toIndex] of doorEdges) {
    const fromPoint = Vec2ToScreenPoint(
      screenOrigin,
      transformedVertices[fromIndex],
      pixelsPerUnit
    );
    const toPoint = Vec2ToScreenPoint(
      screenOrigin,
      transformedVertices[toIndex],
      pixelsPerUnit
    );

    drawLine(ctx, fromPoint, toPoint, 'green');
  }

  const pivotScreenPoint = Vec2ToScreenPoint(
    screenOrigin,
    doorTransform.position,
    pixelsPerUnit
  );

  drawPoint(ctx, pivotScreenPoint, 'red', 6);
  drawText(
    ctx,
    'pivot',
    { x: pivotScreenPoint.x + 10, y: pivotScreenPoint.y - 10 },
    'red'
  );
  drawText(ctx, 'Q / E: rotate   R: reset', { x: 20, y: 30 });
}
