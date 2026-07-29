import { clear, drawLine } from './renderer.js';

const canvas = document.getElementById('canvas');

if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('Canvas not found');
}

const ctx = canvas.getContext('2d');

if (!ctx) {
  throw new Error('2-D context is not supported');
}

const safeCanvas: HTMLCanvasElement = canvas;
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
const a = { x: 100, y: 100 };
const b = { x: 200, y: 100 };
const c = { x: 150, y: 200 };

function render(): void {
  clear(safeCtx);

  drawLine(safeCtx, a, b);
  drawLine(safeCtx, b, c);
  drawLine(safeCtx, c, a);
}
