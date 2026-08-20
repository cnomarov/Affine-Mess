import { expect, test } from '@jest/globals';
import { ScreenPointToVec2, Vec2, Vec2ToScreenPoint } from '../src';
import type { ScreenPoint } from '../src/types';

test('ScreenPointToVec2', () => {
  const origin: ScreenPoint = {
    x: 300,
    y: 300,
  };

  const screenPoint: ScreenPoint = {
    x: 370,
    y: 230,
  };

  const pixelsPerUnit = 70;

  expect(ScreenPointToVec2(origin, screenPoint, pixelsPerUnit)).toEqual(
    new Vec2(1, 1)
  );
});

test('ScreenPointToVec2 and Vec2ToScreenPoint Round-trip', () => {
  const origin: ScreenPoint = {
    x: 300,
    y: 300,
  };

  const mathPoint = new Vec2(2, -3);

  const pixelsPerUnit = 70;

  const screenPoint = Vec2ToScreenPoint(origin, mathPoint, pixelsPerUnit);

  expect(ScreenPointToVec2(origin, screenPoint, pixelsPerUnit)).toEqual(
    new Vec2(2, -3)
  );
});
