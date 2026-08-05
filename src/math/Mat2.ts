import { EPSILON } from '../constants';
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

    // prettier-ignore
    const result = new Mat2(
      c00, c01,
      c10, c11
    );

    return result;
  }

  transpose() {
    const c00 = this.m00;
    const c01 = this.m10;
    const c10 = this.m01;
    const c11 = this.m11;

    // prettier-ignore
    const result = new Mat2(
      c00, c01,
      c10, c11
    );

    return result;
  }

  determinant() {
    const result = this.m00 * this.m11 - this.m01 * this.m10;

    return result;
  }

  inverse() {
    const determinant = this.determinant();
    if (Math.abs(determinant) <= EPSILON) {
      throw new Error('Matrix is not invertible');
    }

    const c00 = this.m11 * (1 / determinant);
    const c01 = -this.m01 * (1 / determinant);
    const c10 = -this.m10 * (1 / determinant);
    const c11 = this.m00 * (1 / determinant);

    // prettier-ignore
    const result = new Mat2(
      c00, c01,
      c10, c11
    );

    return result;
  }

  static identity() {
    // prettier-ignore
    return new Mat2(
      1, 0,
      0, 1
    );
  }

  static rotate(angle: number) {
    const c00 = Math.cos(angle);
    const c01 = Math.sin(angle);
    const c10 = -Math.sin(angle);
    const c11 = Math.cos(angle);

    // prettier-ignore
    const result = new Mat2(
      c00, c01,
      c10, c11
    );

    return result;
  }

  static scale(scaleX: number, scaleY: number) {
    const c00 = scaleX;
    const c01 = 0;
    const c10 = 0;
    const c11 = scaleY;

    // prettier-ignore
    const result = new Mat2(
      c00, c01,
      c10, c11
    );

    return result;
  }

  static uniformScale(scale: number) {
    const result = this.scale(scale, scale);

    return result;
  }

  static shear(shearX: number, shearY: number) {
    const c00 = 1;
    const c01 = shearY;
    const c10 = shearX;
    const c11 = 1;

    // prettier-ignore
    const result = new Mat2(
      c00, c01,
      c10, c11
    );

    return result;
  }

  static reflect(vec: Vec2) {
    const normalizedVec = vec.normalize();

    const c00 = 2 * Math.pow(normalizedVec.x, 2) - 1;
    const c01 = 2 * normalizedVec.x * normalizedVec.y;
    const c10 = 2 * normalizedVec.x * normalizedVec.y;
    const c11 = 2 * Math.pow(normalizedVec.y, 2) - 1;

    // prettier-ignore
    const result = new Mat2(
      c00, c01,
      c10, c11
    );

    return result;
  }

  static project(vec: Vec2) {
    const normalizedVec = vec.normalize();
    const c00 = Math.pow(normalizedVec.x, 2);
    const c01 = normalizedVec.x * normalizedVec.y;
    const c10 = normalizedVec.x * normalizedVec.y;
    const c11 = Math.pow(normalizedVec.y, 2);

    // prettier-ignore
    const result = new Mat2(
      c00, c01,
      c10, c11
    );

    return result;
  }

  static scaleAlongAxis(vec: Vec2, k: number) {
    const normalizedVec = vec.normalize();
    const s = k - 1;
    const c00 = 1 + s * Math.pow(normalizedVec.x, 2);
    const c01 = s * normalizedVec.x * normalizedVec.y;
    const c10 = s * normalizedVec.x * normalizedVec.y;
    const c11 = 1 + s * Math.pow(normalizedVec.y, 2);

    // prettier-ignore
    const result = new Mat2(
      c00, c01,
      c10, c11
    );

    return result;
  }
}
