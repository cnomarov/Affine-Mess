import { expect, test } from '@jest/globals';
import { Transform2D, Vec2 } from '../src';

test('Transform2d method getLocalMatrix', () => {
  const position = new Vec2(3, 2);
  const rotation = 0;
  const scale = new Vec2(1, 1);
  const pivot = new Vec2(0, 0);
  const initialPoint = new Vec2(0, 0);

  const transformMatrix = new Transform2D(
    position,
    rotation,
    scale,
    pivot
  ).getLocalMatrix();

  const result = transformMatrix.transformPoint(initialPoint);

  expect(result.equalsApprox(new Vec2(3, 2))).toBe(true);
});

test('Transform2D applies scale, rotation, and translation from left to right', () => {
  const position = new Vec2(3, 2);
  const rotation = Math.PI / 2;
  const scale = new Vec2(2, 1);
  const pivot = new Vec2(0, 0);

  const initialPoint = new Vec2(1, 0);

  const transformMatrix = new Transform2D(
    position,
    rotation,
    scale,
    pivot
  ).getLocalMatrix();

  const result = transformMatrix.transformPoint(initialPoint);

  expect(result.equalsApprox(new Vec2(3, 4))).toBe(true);
});

test('Transform2D pivot', () => {
  const position = new Vec2(3, 2);
  const rotation = Math.PI / 2;
  const scale = new Vec2(2, 1);
  const pivot = new Vec2(-1, 0);

  const transformMatrix = new Transform2D(
    position,
    rotation,
    scale,
    pivot
  ).getLocalMatrix();

  const result = transformMatrix.transformPoint(pivot);

  expect(result.equalsApprox(new Vec2(3, 2))).toBe(true);
});
