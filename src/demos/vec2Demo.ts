import { Vec2 } from '../math';
import { drawLine } from '../renderer';
import type { ScreenPoint } from '../types';
import { Vec2ToScreenPoint } from '../utils';

const origin: ScreenPoint = {
  x: 300,
  y: 300,
};
const testVector = new Vec2(3, 4);
const xAxis = new Vec2(5, 0);
const scale = 50;

const testVectorProjection = testVector.projectOnto(xAxis);
const testVectorPerpendicular = testVector.perpendicularComponent(xAxis);

const vectorEnd = Vec2ToScreenPoint(origin, testVector, scale);
const projectionEnd = Vec2ToScreenPoint(
  origin,
  testVectorProjection,
  scale
);
const axisEnd = Vec2ToScreenPoint(origin, xAxis, scale);
const perpendicularEnd = Vec2ToScreenPoint(
  projectionEnd,
  testVectorPerpendicular,
  scale
);

export function renderVec2Demo(ctx: CanvasRenderingContext2D): void {
  drawLine(ctx, origin, axisEnd, 'gray');
  drawLine(ctx, origin, vectorEnd, 'blue');
  drawLine(ctx, origin, projectionEnd, 'green');
  drawLine(ctx, projectionEnd, perpendicularEnd, 'red');
}
