import { Mat3, Vec2 } from '../math';
import { type ScreenPoint } from '../types';
import { drawLine, drawPoint, drawText } from '../renderer';
import { Vec2ToScreenPoint } from '../utils';

const origin: ScreenPoint = {
  x: 300,
  y: 300,
};

const pixelsPerUnit = 70;

const initialVec = new Vec2(1, 1);
const translationMat = Mat3.translation(2, 1);
const transformedPoint = translationMat.transformPoint(initialVec);
const transformedDirection = translationMat.transformDirection(initialVec);

const initialPointScreen = Vec2ToScreenPoint(origin, initialVec, pixelsPerUnit);

const transformedPointScreen = Vec2ToScreenPoint(
  origin,
  transformedPoint,
  pixelsPerUnit
);
const transformedDirectionEndScreen = Vec2ToScreenPoint(
  origin,
  transformedDirection,
  pixelsPerUnit
);

const xAxisStartScreen = Vec2ToScreenPoint(
  origin,
  new Vec2(-4, 0),
  pixelsPerUnit
);
const xAxisEndScreen = Vec2ToScreenPoint(
  origin,
  new Vec2(4, 0),
  pixelsPerUnit
);
const yAxisStartScreen = Vec2ToScreenPoint(
  origin,
  new Vec2(0, -2.5),
  pixelsPerUnit
);
const yAxisEndScreen = Vec2ToScreenPoint(
  origin,
  new Vec2(0, 2.5),
  pixelsPerUnit
);

export function renderMat3Demo(ctx: CanvasRenderingContext2D) {
  drawLine(ctx, xAxisStartScreen, xAxisEndScreen, 'gray');
  drawLine(ctx, yAxisStartScreen, yAxisEndScreen, 'gray');

  drawLine(ctx, origin, transformedDirectionEndScreen, 'blue');
  drawLine(ctx, initialPointScreen, transformedPointScreen, 'orange');
  drawPoint(ctx, initialPointScreen, 'gray');
  drawPoint(ctx, transformedPointScreen, 'green');

  drawText(
    ctx,
    'point before: (1,1)',
    { x: initialPointScreen.x + 8, y: initialPointScreen.y + 20 },
    'gray'
  );
  drawText(
    ctx,
    'point after: (3,2)',
    { x: transformedPointScreen.x + 8, y: transformedPointScreen.y - 8 },
    'green'
  );
  drawText(
    ctx,
    'direction after: (1,1)',
    {
      x: transformedDirectionEndScreen.x + 8,
      y: transformedDirectionEndScreen.y - 12,
    },
    'blue'
  );
}
