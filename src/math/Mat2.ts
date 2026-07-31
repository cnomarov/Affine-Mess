import { Vec2 } from './Vec2';

export class Mat2 {
  readonly m00: number;
  readonly m01: number;
  readonly m10: number;
  readonly m11: number;

  constructor(m00: number, m01: number, m10: number, m11: number) {
    this.m00 = m00;
    this.m01 = m01;
    this.m10 = m10;
    this.m11 = m11;
  }

  static identity() {
    return new Mat2(1, 0, 0, 1);
  }

  transformVector(vector: Vec2) {
    const x = vector.x * this.m00 + vector.y * this.m10;
    const y = vector.x * this.m01 + vector.y * this.m11;

    const result = new Vec2(x, y);

    return result;
  }

  multiply(mat: Mat2) {
    const c00 = this.m00 * mat.m00 + this.m01 * mat.m10;
    const c01 = this.m00 * mat.m01 + this.m01 * mat.m11;
    const c10 = this.m10 * mat.m00 + this.m11 * mat.m10;
    const c11 = this.m10 * mat.m01 + this.m11 * mat.m11;

    const result = new Mat2(c00, c01, c10, c11);

    return result;
  }
}
