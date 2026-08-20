import { renderHierarchyDemo } from './demos/hierarchyDemo';
import { clear } from './renderer';
import type { ScreenPoint } from './types';

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

let mouseScreenPoint: ScreenPoint = {
  x: 300,
  y: 300,
};

let isMousePressed = false;

canvas.addEventListener('mousemove', (event) => {
  mouseScreenPoint = {
    x: event.offsetX,
    y: event.offsetY,
  };
});

canvas.addEventListener('mousedown', () => {
  isMousePressed = true;
});

canvas.addEventListener('mouseup', () => {
  isMousePressed = false;
});

canvas.addEventListener('mouseleave', () => {
  isMousePressed = false;
});

function update(): void {}

function loop(): void {
  update();
  render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

function render(): void {
  clear(safeCtx);
  renderHierarchyDemo(safeCtx, mouseScreenPoint, isMousePressed);
}
