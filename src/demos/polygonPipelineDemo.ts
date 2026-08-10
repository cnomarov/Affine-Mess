import { Vec2 } from '../math/Vec2';
import type { ScreenPoint } from '../types';
import { Vec2ToScreenPoint } from '../utils/Vec2ToScreenPoint';
import { drawLine, drawText } from '../renderer';
import { Mat3 } from '../math/Mat3';
import { Transform2D } from '../scene/Transform2D';

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

const transform = new Transform2D(
  new Vec2(2, 1),
  Math.PI / 6,
  new Vec2(1.5, 0.75),
  new Vec2(0, 0)
);

window.addEventListener('keydown', (event) => {
  const step = 0.2;

  if (event.key === 'ArrowLeft')
    transform.position = new Vec2(
      transform.position.x - step,
      transform.position.y
    );

  if (event.key === 'ArrowRight')
    transform.position = new Vec2(
      transform.position.x + step,
      transform.position.y
    );
  if (event.key === 'ArrowUp')
    transform.position = new Vec2(
      transform.position.x,
      transform.position.y + step
    );

  if (event.key === 'ArrowDown')
    transform.position = new Vec2(
      transform.position.x,
      transform.position.y - step
    );
  if (event.key.toLowerCase() === 'q')
    transform.rotation = transform.rotation + Math.PI / 36;

  if (event.key.toLowerCase() === 'e')
    transform.rotation = transform.rotation - Math.PI / 36;
  if (event.key === '+') transform.scale = transform.scale.multiplyScalar(1.1);

  if (event.key === '-') {
    const nextScale = transform.scale.multiplyScalar(0.9);

    if (nextScale.x >= 0.1 && nextScale.y >= 0.1) {
      transform.scale = nextScale;
    }
  }

  if (event.key.toLowerCase() === 'r') {
    transform.position = new Vec2(2, 1);
    transform.rotation = Math.PI / 6;
    transform.scale = new Vec2(1.5, 0.75);
  }
});

export function renderPolygonPipelineDemo(ctx: CanvasRenderingContext2D) {
  const scaleMatrix = Mat3.scale(transform.scale.x, transform.scale.y);
  const rotationMatrix = Mat3.rotate(transform.rotation);

  const scaleThenRotationMatrix = transform.getLocalMatrix();

  const rotationThenScaleMatrix = rotationMatrix
    .multiply(scaleMatrix)
    .multiply(Mat3.translation(transform.position.x + 5, transform.position.y));

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
    new Vec2(transform.position.x - 1.5, transform.position.y + 2),
    pixelsPerUnit
  );
  const secondLabelPoint = Vec2ToScreenPoint(
    origin,
    new Vec2(transform.position.x + 3.5, transform.position.y + 2),
    pixelsPerUnit
  );

  drawText(ctx, 'scale -> rotation', firstLabelPoint, 'green');
  drawText(ctx, 'rotation -> scale', secondLabelPoint, 'purple');
}
