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

export function drawPoint(
  ctx: CanvasRenderingContext2D,
  center: ScreenPoint,
  color: string = 'black',
  radius: number = 5
) {
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
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
