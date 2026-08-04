import type { ScreenPoint } from './types';

export function clear(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
  from: ScreenPoint,
  to: ScreenPoint,
  color: string = 'black'
) {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = color;
  ctx.stroke();
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  point: ScreenPoint,
  color: string = 'black'
) {
  ctx.fillStyle = color;
  ctx.font = '18px sans-serif';
  ctx.fillText(text, point.x, point.y);
}
