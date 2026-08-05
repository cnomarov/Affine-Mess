import { expect, test } from '@jest/globals';
import { Mat2, Vec2 } from '../src';

test('Mat2 method identity', () => {
  // prettier-ignore
  expect(Mat2.identity()).toEqual(new Mat2(
    1, 0,
    0, 1
  ));
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
  // prettier-ignore
  const mat = new Mat2(
    2, 3,
    4, 5
  );
  const matIdentity = Mat2.identity();

  const result1 = mat.multiply(matIdentity);
  const result2 = matIdentity.multiply(mat);

  // prettier-ignore
  expect(result1).toEqual(new Mat2(
    2, 3,
    4, 5
  ));
  // prettier-ignore
  expect(result2).toEqual(new Mat2(
    2, 3,
    4, 5
  ));
  expect(result1).not.toBe(mat);
  expect(result2).not.toBe(mat);
  // prettier-ignore
  expect(mat).toEqual(new Mat2(
    2, 3,
    4, 5
  ));
  // prettier-ignore
  expect(matIdentity).toEqual(new Mat2(
    1, 0,
    0, 1
  ));
});

test('Mat2 method multiply', () => {
  // prettier-ignore
  const matA = new Mat2(
    1, 2,
    3, 4
  );
  // prettier-ignore
  const matB = new Mat2(
    5, 6,
    7, 8
  );

  const result1 = matA.multiply(matB);
  const result2 = matB.multiply(matA);

  // prettier-ignore
  expect(result1).toEqual(new Mat2(
    19, 22,
    43, 50
  ));
  expect(result1).not.toBe(matA);
  expect(result1).not.toBe(matB);

  // prettier-ignore
  expect(result2).toEqual(new Mat2(
    23, 34,
    31, 46
  ));
  expect(result2).not.toBe(matA);
  expect(result2).not.toBe(matB);

  expect(result1).not.toEqual(result2);

  // prettier-ignore
  expect(matA).toEqual(new Mat2(
    1, 2,
    3, 4
  ));
  // prettier-ignore
  expect(matB).toEqual(new Mat2(
    5, 6,
    7, 8
  ));
});

test('Mat2 combined methods transformVector and multiply', () => {
  const a = new Vec2(1, 2);
  // prettier-ignore
  const matA = new Mat2(
    1, 2,
    3, 4
  );
  // prettier-ignore
  const matB = new Mat2(
    5, 6,
    7, 8
  );

  const result1 = matB.transformVector(matA.transformVector(a));
  const result2 = matA.multiply(matB).transformVector(a);

  expect(result1).toEqual(new Vec2(105, 122));
  expect(result2).toEqual(new Vec2(105, 122));
  expect(result1).toEqual(result2);

  // prettier-ignore
  expect(matA).toEqual(new Mat2(
    1, 2,
    3, 4
  ));
  // prettier-ignore
  expect(matB).toEqual(new Mat2(
    5, 6,
    7, 8
  ));
  expect(a).toEqual(new Vec2(1, 2));
});

test('Mat2 method rotate', () => {
  const a = new Vec2(1, 0);
  const mat = Mat2.rotate(Math.PI / 2);
  const b = new Vec2(0, 1);
  const c = new Vec2(-1, 0);

  const result = mat.transformVector(a);
  const result2 = mat.transformVector(b);

  expect(result.equalsApprox(b)).toBe(true);
  expect(result2.equalsApprox(c)).toBe(true);
  expect(a).toEqual(new Vec2(1, 0));
  expect(b).toEqual(new Vec2(0, 1));
  expect(result).not.toBe(a);
  expect(result2).not.toBe(b);
});

test('Mat2 method scale', () => {
  const a = new Vec2(4, 5);
  const scaleX = 2;
  const scaleY = 3;

  const mat = Mat2.scale(scaleX, scaleY);

  const result = mat.transformVector(a);

  expect(result).toEqual(new Vec2(8, 15));
  expect(result).not.toBe(a);
  expect(a).toEqual(new Vec2(4, 5));
});

test('Mat2 method uniformScale', () => {
  const a = new Vec2(4, 5);
  const scale = 2;

  const mat = Mat2.uniformScale(scale);

  const result = mat.transformVector(a);

  expect(result).toEqual(new Vec2(8, 10));
  expect(result).not.toBe(a);
  expect(a).toEqual(new Vec2(4, 5));
});

test('Mat2 method shear', () => {
  const a = new Vec2(3, 4);
  const shearX = 2;
  const shearY = 0;

  const mat = Mat2.shear(shearX, shearY);

  const result = mat.transformVector(a);

  expect(result).toEqual(new Vec2(11, 4));
  expect(result).not.toBe(a);
  expect(a).toEqual(new Vec2(3, 4));
});

test('Mat2 method reflect', () => {
  const a = new Vec2(3, 4);
  const u = new Vec2(5, 0);

  const mat = Mat2.reflect(u);

  const result = mat.transformVector(a);

  expect(result).toEqual(new Vec2(3, -4));
  // prettier-ignore
  expect(mat).toEqual(new Mat2(
    1, 0,
    0, -1
  ));
  expect(result).not.toBe(a);
  expect(u).toEqual(new Vec2(5, 0));
  expect(a).toEqual(new Vec2(3, 4));
});

test('Mat2 method project', () => {
  const a = new Vec2(3, 4);
  const u = new Vec2(5, 0);

  const mat = Mat2.project(u);

  const result = mat.transformVector(a);

  expect(result).toEqual(new Vec2(3, 0));
  // prettier-ignore
  expect(mat).toEqual(new Mat2(
    1, 0,
    0, 0
  ));
  expect(result).not.toBe(a);
  expect(u).toEqual(new Vec2(5, 0));
  expect(a).toEqual(new Vec2(3, 4));
});

test('Mat2 method scaleAlongAxis', () => {
  const a = new Vec2(1, 1);
  const b = new Vec2(-1, 1);
  const u = new Vec2(1, 1);
  const k = 2;

  const mat = Mat2.scaleAlongAxis(u, k);

  const result = mat.transformVector(a);
  const result2 = mat.transformVector(b);

  expect(result.equalsApprox(new Vec2(2, 2))).toBe(true);
  expect(result2.equalsApprox(new Vec2(-1, 1))).toBe(true);

  expect(result).not.toBe(a);
  expect(result2).not.toBe(b);

  expect(u).toEqual(new Vec2(1, 1));
  expect(a).toEqual(new Vec2(1, 1));
  expect(b).toEqual(new Vec2(-1, 1));
});

test('Mat2 method transpose', () => {
  // prettier-ignore
  const mat = new Mat2(
    1, 2,
    3, 4
  );
  const result = mat.transpose();

  // prettier-ignore
  expect(result).toEqual(new Mat2(
    1, 3,
    2, 4
  ));
  expect(result).not.toBe(mat);
  // prettier-ignore
  expect(mat).toEqual(new Mat2(
    1, 2,
    3, 4
  ));
});

test('Mat2 method determinant ', () => {
  // prettier-ignore
  const mat = new Mat2(
    2, 3,
    1, 4
  );
  const result = mat.determinant();

  expect(result).toBe(5);
  // prettier-ignore
  expect(mat).toEqual(new Mat2(
    2, 3,
    1, 4
  ));
});

test('Mat2 method determinant through rotation', () => {
  const mat = Mat2.rotate(Math.PI / 3);
  const result = mat.determinant();

  expect(result).toBeCloseTo(1);
  expect(mat).toEqual(Mat2.rotate(Math.PI / 3));
});

test('Mat2 method determinant through scale', () => {
  const scaleX = 2;
  const scaleY = 3;

  const mat = Mat2.scale(scaleX, scaleY);

  const result = mat.determinant();

  expect(result).toBeCloseTo(6);
  // prettier-ignore
  expect(mat).toEqual(new Mat2(
    2, 0,
    0, 3
  ));
});

test('Mat2 method determinant through reflect', () => {
  const u = new Vec2(1, 2);

  const mat = Mat2.reflect(u);
  const result = mat.determinant();

  expect(result).toBeCloseTo(-1);
});

test('Mat2 method determinant through project', () => {
  const u = new Vec2(1, 2);

  const mat = Mat2.project(u);
  const result = mat.determinant();

  expect(result).toBeCloseTo(0);
});

test('Mat2 method inverse', () => {
  // prettier-ignore
  const mat = new Mat2(
    2, 0,
    0, 3
  );

  const inverse = mat.inverse();
  const product1 = mat.multiply(inverse);
  const product2 = inverse.multiply(mat);

  expect(inverse.m00).toBeCloseTo(1 / 2);
  expect(inverse.m01).toBeCloseTo(0);
  expect(inverse.m10).toBeCloseTo(0);
  expect(inverse.m11).toBeCloseTo(1 / 3);

  expect(product1.m00).toBeCloseTo(1);
  expect(product1.m01).toBeCloseTo(0);
  expect(product1.m10).toBeCloseTo(0);
  expect(product1.m11).toBeCloseTo(1);

  expect(product2.m00).toBeCloseTo(1);
  expect(product2.m01).toBeCloseTo(0);
  expect(product2.m10).toBeCloseTo(0);
  expect(product2.m11).toBeCloseTo(1);

  expect(inverse).not.toBe(mat);
  // prettier-ignore
  expect(mat).toEqual(new Mat2(
    2, 0,
    0, 3
  ));
});

test('Mat2 method inverse rejects a singular matrix', () => {
  const singular = Mat2.project(new Vec2(1, 2));

  expect(() => singular.inverse()).toThrow('Matrix is not invertible');
});
