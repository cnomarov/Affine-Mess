import type { Vec2 } from '../math/Vec2';
import type { ScreenPoint } from '../types';

export function Vec2ToScreenPoint(origin: ScreenPoint, a: Vec2, scale: number) {
  return {
    x: origin.x + a.x * scale,
    y: origin.y - a.y * scale,
  };
}
