import { expect, test } from '@jest/globals';
import { Vec2 } from '../src/';

test('Vec2 method add', () => {
  const a = new Vec2(2, 3);
  const b = new Vec2(3, 4);
  const result = a.add(b);

  expect(result).toEqual(new Vec2(5, 7));
  expect(result).toBeInstanceOf(Vec2);
  expect(a).toEqual(new Vec2(2, 3));
  expect(b).toEqual(new Vec2(3, 4));
});

test('Vec2 method subtract', () => {
  const a = new Vec2(2, 3);
  const b = new Vec2(3, 4);
  const result = a.subtract(b);

  expect(result).toEqual(new Vec2(-1, -1));
  expect(result).toBeInstanceOf(Vec2);
  expect(a).toEqual(new Vec2(2, 3));
  expect(b).toEqual(new Vec2(3, 4));
});

test('Vec2 method multiplyScalar', () => {
  const a = new Vec2(2, 3);
  const k = 2;
  const result = a.multiplyScalar(k);

  expect(result).toEqual(new Vec2(4, 6));
  expect(result).toBeInstanceOf(Vec2);
  expect(a).toEqual(new Vec2(2, 3));
});

test('Vec2 method negate', () => {
  const a = new Vec2(2, 3);
  const result = a.negate();

  expect(result).toEqual(new Vec2(-2, -3));
  expect(result).toBeInstanceOf(Vec2);
  expect(a).toEqual(new Vec2(2, 3));
});

test('Vec2 method lengthSquared', () => {
  const a = new Vec2(3, 4);
  const result = a.lengthSquared();

  expect(result).toBe(25);
  expect(a).toEqual(new Vec2(3, 4));
});

test('Vec2 method length', () => {
  const a = new Vec2(3, 4);
  const result = a.length();

  expect(result).toBe(5);
  expect(a).toEqual(new Vec2(3, 4));
});

test('Vec2 method normalize', () => {
  const a = new Vec2(3, 4);
  const result = a.normalize();
  const resultLength = result.length();

  expect(result).toEqual(new Vec2(0.6, 0.8));
  expect(resultLength).toBe(1);
  expect(a).toEqual(new Vec2(3, 4));
});

test('Vec2 method normalize error', () => {
  const a = new Vec2(0, 0);

  expect(() => a.normalize()).toThrow('Vector (0,0) cannot be normalized');
  expect(a).toEqual(new Vec2(0, 0));
});

test('Vec2 method dot', () => {
  const a = new Vec2(2, 3);
  const b = new Vec2(4, 1);
  const result = a.dot(b);

  expect(result).toBe(11);
  expect(a).toEqual(new Vec2(2, 3));
  expect(b).toEqual(new Vec2(4, 1));
});

test('Vec2 method perpendicular', () => {
  const a = new Vec2(3, 4);
  const result = a.perpendicular();
  const resultDot = a.dot(result);

  expect(result).toEqual(new Vec2(-4, 3));
  expect(resultDot).toBe(0);
  expect(a).toEqual(new Vec2(3, 4));
});

test('Vec2 method equalsApprox true', () => {
  const a = new Vec2(1, 2);
  const b = new Vec2(1.0000000001, 1.9999999999);
  const result = a.equalsApprox(b);

  expect(result).toBe(true);
  expect(a).toEqual(new Vec2(1, 2));
  expect(b).toEqual(new Vec2(1.0000000001, 1.9999999999));
});

test('Vec2 method equalsApprox false', () => {
  const a = new Vec2(1, 2);
  const b = new Vec2(3, 4);
  const result = a.equalsApprox(b);

  expect(result).toBe(false);
  expect(a).toEqual(new Vec2(1, 2));
  expect(b).toEqual(new Vec2(3, 4));
});

test('Vec2 method distanceTo', () => {
  const a = new Vec2(2, 3);
  const b = new Vec2(5, 7);
  const result = a.distanceTo(b);

  expect(result).toBe(5);
  expect(a).toEqual(new Vec2(2, 3));
  expect(b).toEqual(new Vec2(5, 7));
});

test('Vec2 method projectOnto', () => {
  const a = new Vec2(3, 4);
  const b = new Vec2(1, 0);
  const result = a.projectOnto(b);

  expect(result).toEqual(new Vec2(3, 0));
  expect(a).toEqual(new Vec2(3, 4));
  expect(b).toEqual(new Vec2(1, 0));
});

test('Vec2 method projectOnto error', () => {
  const a = new Vec2(3, 4);
  const b = new Vec2(0, 0);

  expect(() => a.projectOnto(b)).toThrow('Vector (0,0) cannot be normalized');
  expect(a).toEqual(new Vec2(3, 4));
  expect(b).toEqual(new Vec2(0, 0));
});

test('Vec2 method parallelComponent', () => {
  const a = new Vec2(3, 4);
  const b = new Vec2(1, 0);
  const result = a.parallelComponent(b);

  expect(result).toEqual(new Vec2(3, 0));
  expect(a).toEqual(new Vec2(3, 4));
  expect(b).toEqual(new Vec2(1, 0));
});

test('Vec2 method parallelComponent error', () => {
  const a = new Vec2(3, 4);
  const b = new Vec2(0, 0);

  expect(() => a.parallelComponent(b)).toThrow(
    'Vector (0,0) cannot be normalized'
  );
  expect(a).toEqual(new Vec2(3, 4));
  expect(b).toEqual(new Vec2(0, 0));
});

test('Vec2 method perpendicularComponent', () => {
  const a = new Vec2(3, 4);
  const b = new Vec2(1, 0);
  const result = a.perpendicularComponent(b);

  expect(result).toEqual(new Vec2(0, 4));
  expect(a).toEqual(new Vec2(3, 4));
  expect(b).toEqual(new Vec2(1, 0));
});

test('Vec2 method perpendicularComponent error', () => {
  const a = new Vec2(3, 4);
  const b = new Vec2(0, 0);

  expect(() => a.perpendicularComponent(b)).toThrow(
    'Vector (0,0) cannot be normalized'
  );
  expect(a).toEqual(new Vec2(3, 4));
  expect(b).toEqual(new Vec2(0, 0));
});
