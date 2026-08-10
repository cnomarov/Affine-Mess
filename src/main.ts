import { renderPivotDemo } from './demos/pivotDemo';
import { clear } from './renderer';

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

function render(): void {
  clear(safeCtx);
  renderPivotDemo(safeCtx);
}
