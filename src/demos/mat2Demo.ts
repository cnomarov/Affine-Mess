import { Vec2 } from '../math/Vec2';
import { drawLine, drawText } from '../renderer';
import { Vec2ToScreenPoint } from '../utils/Vec2ToScreenPoint';
import type { ScreenPoint } from '../types';
import { Mat2 } from '../math/Mat2';

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

const basisAxes: Vec2[] = [new Vec2(1, 0), new Vec2(0, 1)];

const pixelsPerUnit = 70;

const scaleX = 1.5;
const scaleY = 0.75;

const shearX = 0.5;
const shearY = 0;

const rotationAngle = Math.PI / 6;

const scaleMat = Mat2.scale(scaleX, scaleY);
const shearMat = Mat2.shear(shearX, shearY);
const rotationMat = Mat2.rotate(rotationAngle);
const transformMatrix = scaleMat.multiply(shearMat.multiply(rotationMat));
const determinant = transformMatrix.determinant();
const determinantPoint: ScreenPoint = {
  x: 20,
  y: 30,
};

const transformedVertices = squareVertices.map((vertex) => {
  return transformMatrix.transformVector(vertex);
});

const transformedBasisAxes = basisAxes.map((basisAxis) => {
  return transformMatrix.transformVector(basisAxis);
});

export function renderMat2Demo(ctx: CanvasRenderingContext2D) {
  drawText(
    ctx,
    `determinant: ${determinant.toFixed(3)}`,
    determinantPoint
  );

  for (const basisAxis of basisAxes) {
    const positiveAxis = basisAxis.multiplyScalar(2.5);
    const negativeAxis = positiveAxis.negate();

    const fromPoint = Vec2ToScreenPoint(origin, positiveAxis, pixelsPerUnit);
    const toPoint = Vec2ToScreenPoint(origin, negativeAxis, pixelsPerUnit);

    drawLine(ctx, fromPoint, toPoint, 'gray');
  }

  for (const [index, transformedBasisAxis] of transformedBasisAxes.entries()) {
    const positiveAxis = transformedBasisAxis.multiplyScalar(2.5);
    const toPoint = Vec2ToScreenPoint(origin, positiveAxis, pixelsPerUnit);
    const color = index === 0 ? 'red' : 'blue';

    drawLine(ctx, origin, toPoint, color);
  }

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

    const fromVec = transformedVertices[fromIndex];
    const toVec = transformedVertices[toIndex];

    const fromPoint = Vec2ToScreenPoint(origin, fromVec, pixelsPerUnit);
    const toPoint = Vec2ToScreenPoint(origin, toVec, pixelsPerUnit);

    drawLine(ctx, fromPoint, toPoint, 'green');
  }
}
