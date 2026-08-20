import { Vec2 } from '../math';
import type { ScreenPoint } from '../types';

export function ScreenPointToVec2(
  origin: ScreenPoint,
  screenPoint: ScreenPoint,
  pixelsPerUnit: number
): Vec2 {
  const x = (screenPoint.x - origin.x) / pixelsPerUnit;
  const y = (origin.y - screenPoint.y) / pixelsPerUnit;
  return new Vec2(x, y);
}
