import { Mat3, Vec2, Mat2 } from '../src';
import { expect, test } from '@jest/globals';

test('Mat3 method identity', () => {
  const mat = Mat3.identity();

  // prettier-ignore
  expect(mat).toEqual(new Mat3(
    1, 0, 0, 
    0, 1, 0, 
    0, 0, 1
));
});

test('Mat3 method multiply through identity', () => {
  // prettier-ignore
  const mat = new Mat3(
        1, 2, 3,
        4, 5, 6,
        7, 8, 9
    );

  const matIdentity = Mat3.identity();

  const result1 = mat.multiply(matIdentity);
  const result2 = matIdentity.multiply(mat);

  expect(result1).toEqual(new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9));
  expect(result2).toEqual(new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9));
  expect(mat).toEqual(new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9));
  expect(result1).not.toBe(mat);
  expect(result2).not.toBe(mat);
  expect(matIdentity).toEqual(new Mat3(1, 0, 0, 0, 1, 0, 0, 0, 1));
});

test('Mat3 method multiply', () => {
  const A = new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
  const B = new Mat3(9, 8, 7, 6, 5, 4, 3, 2, 1);

  const result = A.multiply(B);

  expect(result).toEqual(new Mat3(30, 24, 18, 84, 69, 54, 138, 114, 90));
  expect(result).not.toBe(A);
  expect(A).toEqual(new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9));
  expect(B).toEqual(new Mat3(9, 8, 7, 6, 5, 4, 3, 2, 1));
});

test('Mat3 method translation', () => {
  const tx = 3;
  const ty = 4;

  const mat = Mat3.translation(tx, ty);

  expect(mat).toEqual(new Mat3(1, 0, 0, 0, 1, 0, 3, 4, 1));
});

test('Mat3 method transformPoint', () => {
  const vec = new Vec2(1, 2);
  const tx = 3;
  const ty = 4;

  const mat = Mat3.translation(tx, ty);

  const result = mat.transformPoint(vec);

  expect(result).toEqual(new Vec2(4, 6));
  expect(result).not.toBe(vec);
  expect(vec).toEqual(new Vec2(1, 2));
  expect(mat).toEqual(new Mat3(1, 0, 0, 0, 1, 0, 3, 4, 1));
});

test('Mat3 method transformDirection', () => {
  const vec = new Vec2(1, 2);
  const tx = 3;
  const ty = 4;

  const mat = Mat3.translation(tx, ty);

  const result = mat.transformDirection(vec);

  expect(result).toEqual(new Vec2(1, 2));
  expect(result).not.toBe(vec);
  expect(vec).toEqual(new Vec2(1, 2));
  expect(mat).toEqual(new Mat3(1, 0, 0, 0, 1, 0, 3, 4, 1));
});

test('Mat3 method rotate', () => {
  const angle = Math.PI / 2;
  const mat3 = Mat3.rotate(angle);
  const mat2 = Mat2.rotate(angle);
  const vec = new Vec2(1, 0);
  const newVec = new Vec2(0, 1);

  const result = mat3.transformDirection(vec);
  const result2 = mat2.transformVector(vec);

  expect(result.equalsApprox(newVec)).toBe(true);
  expect(result2.equalsApprox(newVec)).toBe(true);
  expect(result.equalsApprox(result2)).toBe(true);
  expect(vec).toEqual(new Vec2(1, 0));
  expect(result).not.toBe(vec);
});

test('Mat3 method scale', () => {
  const vec = new Vec2(3, 4);
  const scaleX = 2;
  const scaleY = 3;

  const mat3 = Mat3.scale(scaleX, scaleY);
  const mat2 = Mat2.scale(scaleX, scaleY);

  const result = mat3.transformDirection(vec);
  const result2 = mat2.transformVector(vec);

  expect(result).toEqual(new Vec2(6, 12));
  expect(result2).toEqual(new Vec2(6, 12));
  expect(result.equalsApprox(result2)).toBe(true);
  expect(vec).toEqual(new Vec2(3, 4));
  expect(result).not.toBe(vec);
});

test('Mat3 method fromMat2', () => {
  const mat2 = new Mat2(1, 2, 3, 4);
  const mat3 = Mat3.fromMat2(mat2);
  const vec = new Vec2(2, 3);

  const mat2Result = mat2.transformVector(vec);
  const mat3Result = mat3.transformDirection(vec);

  expect(mat3).toEqual(new Mat3(1, 2, 0, 3, 4, 0, 0, 0, 1));
  expect(mat2).toEqual(new Mat2(1, 2, 3, 4));
  expect(mat2Result).toEqual(new Vec2(11, 16));
  expect(mat3Result).toEqual(new Vec2(11, 16));
  expect(mat2Result.equalsApprox(mat3Result)).toBe(true);
  expect(mat2Result).not.toBe(vec);
  expect(mat3Result).not.toBe(vec);
  expect(vec).toEqual(new Vec2(2, 3));
});

test('Mat3 method transpose', () => {
  const mat = new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
  const newMat = mat.transpose();

  expect(newMat).toEqual(new Mat3(1, 4, 7, 2, 5, 8, 3, 6, 9));
  expect(newMat).not.toBe(mat);
  expect(mat).toEqual(new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9));
});

test('Mat3 method determinant', () => {
  const mat = new Mat3(1, 2, 3, 0, 1, 4, 5, 6, 0);
  const determinant = mat.determinant();

  expect(determinant).toBe(1);
  expect(mat).toEqual(new Mat3(1, 2, 3, 0, 1, 4, 5, 6, 0));
});

test('Mat3 method determinant through other methods', () => {
  const angle = Math.PI / 2;
  const tx = 3;
  const ty = 4;
  const scaleX = 2;
  const scaleY = 3;
  const rotateMat = Mat3.rotate(angle);
  const translationMat = Mat3.translation(tx, ty);
  const scaleMat = Mat3.scale(scaleX, scaleY);

  const result1 = rotateMat.determinant();
  const result2 = translationMat.determinant();
  const result3 = scaleMat.determinant();

  expect(result1).toBe(1);
  expect(result2).toBe(1);
  expect(result3).toBe(6);
});

test('Mat3 method equalsApprox', () => {
  const A = new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
  const B = new Mat3(
    1 + 1e-10,
    2 - 1e-10,
    3 + 1e-10,
    4 - 1e-10,
    5 + 1e-10,
    6 - 1e-10,
    7 + 1e-10,
    8 - 1e-10,
    9 + 1e-10
  );
  const C = new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9.001);

  expect(A.equalsApprox(B)).toBe(true);
  expect(B.equalsApprox(A)).toBe(true);
  expect(A.equalsApprox(C)).toBe(false);

  expect(A).toEqual(new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9));
  expect(B).toEqual(
    new Mat3(
      1 + 1e-10,
      2 - 1e-10,
      3 + 1e-10,
      4 - 1e-10,
      5 + 1e-10,
      6 - 1e-10,
      7 + 1e-10,
      8 - 1e-10,
      9 + 1e-10
    )
  );
  expect(C).toEqual(new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9.001));
});

test('Mat3 method inverse', () => {
  const A = new Mat3(1, 2, 3, 0, 1, 4, 5, 6, 0);
  const determinantA = A.determinant();
  const inverseA = A.inverse();
  const identityMatrix = Mat3.identity();

  const result = A.multiply(inverseA);
  const result2 = inverseA.multiply(A);

  expect(
    inverseA.equalsApprox(new Mat3(-24, 18, 5, 20, -15, -4, -5, 4, 1))
  ).toBe(true);
  expect(determinantA).toBe(1);
  expect(result.equalsApprox(identityMatrix)).toBe(true);
  expect(result2.equalsApprox(identityMatrix)).toBe(true);
  expect(inverseA).not.toBe(A);
  expect(A).toEqual(new Mat3(1, 2, 3, 0, 1, 4, 5, 6, 0));
});

test('Mat3 method inverse rejects a singular matrix', () => {
  const singular = new Mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);

  expect(() => singular.inverse()).toThrow('Matrix is not invertible');
});

test('Mat3 composition and inverse restore the original point', () => {
  const point = new Vec2(2, -1);
  const scale = Mat3.scale(2, 3);
  const rotation = Mat3.rotate(Math.PI / 6);
  const translation = Mat3.translation(5, -4);
  const transform = scale.multiply(rotation).multiply(translation);

  const sequentiallyTransformed = translation.transformPoint(
    rotation.transformPoint(scale.transformPoint(point))
  );
  const transformed = transform.transformPoint(point);
  const restored = transform.inverse().transformPoint(transformed);

  expect(transformed.equalsApprox(sequentiallyTransformed)).toBe(true);
  expect(restored.equalsApprox(point)).toBe(true);
  expect(transformed).not.toBe(point);
  expect(restored).not.toBe(point);
  expect(point).toEqual(new Vec2(2, -1));
});
