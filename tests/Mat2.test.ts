import { expect, test } from '@jest/globals';
import { Mat2, Vec2 } from '../src';

test('Mat2 method identity', () => {
  expect(Mat2.identity()).toEqual(new Mat2(1, 0, 0, 1));
});

test('Mat2 method transformVector through identity', () => {
  const a = new Vec2(3, 4);
  const matIdentity = Mat2.identity();

  const result = matIdentity.transformVector(a);

  expect(result).toEqual(new Vec2(3, 4));
  expect(a).toEqual(new Vec2(3, 4));
  expect(result).not.toBe(a);
});

test('Mat2 method multiply through identity', () => {
  const mat = new Mat2(2, 3, 4, 5);
  const matIdentity = Mat2.identity();

  const result1 = mat.multiply(matIdentity);
  const result2 = matIdentity.multiply(mat);

  expect(result1).toEqual(new Mat2(2, 3, 4, 5));
  expect(result2).toEqual(new Mat2(2, 3, 4, 5));
  expect(result1).not.toBe(mat);
  expect(result2).not.toBe(mat);
  expect(mat).toEqual(new Mat2(2, 3, 4, 5));
  expect(matIdentity).toEqual(new Mat2(1, 0, 0, 1));
});

test('Mat2 method multiply', () => {
  const matA = new Mat2(1, 2, 3, 4);
  const matB = new Mat2(5, 6, 7, 8);

  const result1 = matA.multiply(matB);
  const result2 = matB.multiply(matA);

  expect(result1).toEqual(new Mat2(19, 22, 43, 50));
  expect(result1).not.toBe(matA);
  expect(result1).not.toBe(matB);

  expect(result2).toEqual(new Mat2(23, 34, 31, 46));
  expect(result2).not.toBe(matA);
  expect(result2).not.toBe(matB);

  expect(result1).not.toEqual(result2);

  expect(matA).toEqual(new Mat2(1, 2, 3, 4));
  expect(matB).toEqual(new Mat2(5, 6, 7, 8));
});

test('Mat2 combined methods transformVector and multiply', () => {
  const a = new Vec2(1, 2);
  const matA = new Mat2(1, 2, 3, 4);
  const matB = new Mat2(5, 6, 7, 8);

  const result1 = matB.transformVector(matA.transformVector(a));
  const result2 = matA.multiply(matB).transformVector(a);

  expect(result1).toEqual(new Vec2(105, 122));
  expect(result2).toEqual(new Vec2(105, 122));
  expect(result1).toEqual(result2);

  expect(matA).toEqual(new Mat2(1, 2, 3, 4));
  expect(matB).toEqual(new Mat2(5, 6, 7, 8));
  expect(a).toEqual(new Vec2(1, 2));
});
