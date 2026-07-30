import { clear, drawLine } from './renderer';
import { Vec2ToScreenPoint } from './utils/Vec2ToScreenPoint';
import { Vec2 } from './math/Vec2';
import type { ScreenPoint } from './types';

export const origin: ScreenPoint = {
  x: 300,
  y: 300,
};
export const testVector = new Vec2(3, 4);
export const xAxis = new Vec2(5, 0);
export const scale = 50;

const testVectorProjection = testVector.projectOnto(xAxis); //(3,0)
const testVectorPerpendicular = testVector.perpendicularComponent(xAxis); //(0,4)

const canvas = document.getElementById('canvas');

if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('Canvas not found');
}

const ctx = canvas.getContext('2d');

if (!ctx) {
  throw new Error('2-D context is not supported');
}

const safeCtx: CanvasRenderingContext2D = ctx;

canvas.width = window.innerWidth;
canvas.height = 500;

function update(): void {}

function loop(): void {
  update();
  render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
const vectorEnd: ScreenPoint = Vec2ToScreenPoint(origin, testVector, scale);
const projectionEnd: ScreenPoint = Vec2ToScreenPoint(
  origin,
  testVectorProjection,
  scale
);
const axisEnd: ScreenPoint = Vec2ToScreenPoint(origin, xAxis, scale);
const perpendicularEnd: ScreenPoint = Vec2ToScreenPoint(
  projectionEnd,
  testVectorPerpendicular,
  scale
);

function render(): void {
  clear(safeCtx);

  drawLine(safeCtx, origin, axisEnd, 'gray');
  drawLine(safeCtx, origin, vectorEnd, 'blue');
  drawLine(safeCtx, origin, projectionEnd, 'green');
  drawLine(safeCtx, projectionEnd, perpendicularEnd, 'red');
}
