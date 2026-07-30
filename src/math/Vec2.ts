import { EPSILON } from '../constants';

export class Vec2 {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(b: Vec2) {
    const x = this.x + b.x;
    const y = this.y + b.y;
    const result = new Vec2(x, y);

    return result;
  }

  subtract(b: Vec2) {
    const x = this.x - b.x;
    const y = this.y - b.y;

    const result = new Vec2(x, y);

    return result;
  }

  multiplyScalar(k: number) {
    const x = this.x * k;
    const y = this.y * k;

    const result = new Vec2(x, y);

    return result;
  }

  negate() {
    const x = this.x * -1;
    const y = this.y * -1;

    const result = new Vec2(x, y);
    return result;
  }

  lengthSquared() {
    const result = this.x ** 2 + this.y ** 2;
    return result;
  }

  length() {
    return Math.sqrt(this.lengthSquared());
  }

  normalize() {
    if (this.x === 0 && this.y === 0) {
      throw new Error('Vector (0,0) cannot be normalized');
    }
    const length = this.length();
    const x = this.x / length;
    const y = this.y / length;

    const result = new Vec2(x, y);
    return result;
  }

  dot(b: Vec2) {
    const result = this.x * b.x + this.y * b.y;
    return result;
  }

  perpendicular() {
    const x = -this.y;
    const y = this.x;
    const result = new Vec2(x, y);

    return result;
  }

  equalsApprox(b: Vec2) {
    return (
      Math.abs(this.x - b.x) <= EPSILON && Math.abs(this.y - b.y) <= EPSILON
    );
  }

  distanceTo(b: Vec2) {
    const c = b.subtract(this);
    const result = c.length();

    return result;
  }

  projectOnto(axis: Vec2) {
    const axisNormalized = axis.normalize();
    const dotResult = this.dot(axisNormalized);
    const result = axisNormalized.multiplyScalar(dotResult);

    return result;
  }

  parallelComponent(axis: Vec2) {
    return this.projectOnto(axis);
  }

  perpendicularComponent(axis: Vec2) {
    return this.subtract(this.parallelComponent(axis));
  }
}
