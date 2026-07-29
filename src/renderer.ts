type ScreenPoint = {
  x: number;
  y: number;
};

export function clear(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export function drawLine(
  ctx: CanvasRenderingContext2D,
  from: ScreenPoint,
  to: ScreenPoint
) {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}
