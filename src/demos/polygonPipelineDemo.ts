import { Vec2 } from '../math/Vec2';
import type { ScreenPoint } from '../types';
import { Vec2ToScreenPoint } from '../utils/Vec2ToScreenPoint';
import { drawLine, drawText } from '../renderer';
import { Mat3 } from '../math/Mat3';

const squareVertices: Vec2[] = [
  new Vec2(-1, -1),
  new Vec2(1, -1),
  new Vec2(1, 1),
  new Vec2(-1, 1),
];

const squareEdges: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
];

const origin: ScreenPoint = {
  x: 180,
  y: 250,
};

const pixelsPerUnit = 70;
let positionX = 2;
let positionY = 1;
let rotation = Math.PI / 6;
let scale = 1;

window.addEventListener('keydown', (event) => {
  const step = 0.2;

  if (event.key === 'ArrowLeft') positionX -= step;
  if (event.key === 'ArrowRight') positionX += step;
  if (event.key === 'ArrowUp') positionY += step;
  if (event.key === 'ArrowDown') positionY -= step;
  if (event.key.toLowerCase() === 'q') rotation += Math.PI / 36;
  if (event.key.toLowerCase() === 'e') rotation -= Math.PI / 36;
  if (event.key === '+') scale += 0.1;
  if (event.key === '-') scale = Math.max(0.1, scale - 0.1);
  if (event.key.toLowerCase() === 'r') {
    positionX = 2;
    positionY = 1;
    rotation = Math.PI / 6;
    scale = 1;
  }
});

export function renderPolygonPipelineDemo(ctx: CanvasRenderingContext2D) {
  const scaleMatrix = Mat3.scale(1.5 * scale, 0.75 * scale);
  const rotationMatrix = Mat3.rotate(rotation);

  const scaleThenRotationMatrix = scaleMatrix
    .multiply(rotationMatrix)
    .multiply(Mat3.translation(positionX, positionY));

  const rotationThenScaleMatrix = rotationMatrix
    .multiply(scaleMatrix)
    .multiply(Mat3.translation(positionX + 5, positionY));

  const scaleThenRotationVertices = squareVertices.map((vertex) => {
    return scaleThenRotationMatrix.transformPoint(vertex);
  });

  const rotationThenScaleVertices = squareVertices.map((vertex) => {
    return rotationThenScaleMatrix.transformPoint(vertex);
  });

  for (const squareEdge of squareEdges) {
    const fromIndex = squareEdge[0];
    const toIndex = squareEdge[1];

    const fromVec = squareVertices[fromIndex];
    const toVec = squareVertices[toIndex];

    const fromPoint = Vec2ToScreenPoint(origin, fromVec, pixelsPerUnit);
    const toPoint = Vec2ToScreenPoint(origin, toVec, pixelsPerUnit);

    drawLine(ctx, fromPoint, toPoint);
  }

  for (const squareEdge of squareEdges) {
    const fromIndex = squareEdge[0];
    const toIndex = squareEdge[1];

    const fromVec = scaleThenRotationVertices[fromIndex];
    const toVec = scaleThenRotationVertices[toIndex];

    const fromPoint = Vec2ToScreenPoint(origin, fromVec, pixelsPerUnit);
    const toPoint = Vec2ToScreenPoint(origin, toVec, pixelsPerUnit);

    drawLine(ctx, fromPoint, toPoint, 'green');
  }

  for (const squareEdge of squareEdges) {
    const fromIndex = squareEdge[0];
    const toIndex = squareEdge[1];

    const fromVec = rotationThenScaleVertices[fromIndex];
    const toVec = rotationThenScaleVertices[toIndex];

    const fromPoint = Vec2ToScreenPoint(origin, fromVec, pixelsPerUnit);
    const toPoint = Vec2ToScreenPoint(origin, toVec, pixelsPerUnit);

    drawLine(ctx, fromPoint, toPoint, 'purple');
  }

  const firstLabelPoint = Vec2ToScreenPoint(
    origin,
    new Vec2(positionX - 1.5, positionY + 2),
    pixelsPerUnit
  );
  const secondLabelPoint = Vec2ToScreenPoint(
    origin,
    new Vec2(positionX + 3.5, positionY + 2),
    pixelsPerUnit
  );

  drawText(ctx, 'scale -> rotation', firstLabelPoint, 'green');
  drawText(ctx, 'rotation -> scale', secondLabelPoint, 'purple');
}
