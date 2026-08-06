import { Vec2 } from './Vec2';
import { Mat2 } from './Mat2';
import { EPSILON } from '../constants';

export class Mat3 {
  readonly m00: number;
  readonly m01: number;
  readonly m02: number;
  readonly m10: number;
  readonly m11: number;
  readonly m12: number;
  readonly m20: number;
  readonly m21: number;
  readonly m22: number;

  constructor(
    m00: number,
    m01: number,
    m02: number,
    m10: number,
    m11: number,
    m12: number,
    m20: number,
    m21: number,
    m22: number
  ) {
    this.m00 = m00;
    this.m01 = m01;
    this.m02 = m02;
    this.m10 = m10;
    this.m11 = m11;
    this.m12 = m12;
    this.m20 = m20;
    this.m21 = m21;
    this.m22 = m22;
  }

  multiply(mat: Mat3) {
    const c00 = this.m00 * mat.m00 + this.m01 * mat.m10 + this.m02 * mat.m20;
    const c01 = this.m00 * mat.m01 + this.m01 * mat.m11 + this.m02 * mat.m21;
    const c02 = this.m00 * mat.m02 + this.m01 * mat.m12 + this.m02 * mat.m22;
    const c10 = this.m10 * mat.m00 + this.m11 * mat.m10 + this.m12 * mat.m20;
    const c11 = this.m10 * mat.m01 + this.m11 * mat.m11 + this.m12 * mat.m21;
    const c12 = this.m10 * mat.m02 + this.m11 * mat.m12 + this.m12 * mat.m22;
    const c20 = this.m20 * mat.m00 + this.m21 * mat.m10 + this.m22 * mat.m20;
    const c21 = this.m20 * mat.m01 + this.m21 * mat.m11 + this.m22 * mat.m21;
    const c22 = this.m20 * mat.m02 + this.m21 * mat.m12 + this.m22 * mat.m22;

    // prettier-ignore
    const result = new Mat3(
      c00, c01, c02,
      c10, c11, c12,
      c20, c21, c22
    );

    return result;
  }

  transformPoint(vec: Vec2) {
    const newX = vec.x * this.m00 + vec.y * this.m10 + this.m20;
    const newY = vec.x * this.m01 + vec.y * this.m11 + this.m21;

    const result = new Vec2(newX, newY);

    return result;
  }

  transformDirection(vec: Vec2) {
    const newX = vec.x * this.m00 + vec.y * this.m10;
    const newY = vec.x * this.m01 + vec.y * this.m11;

    const result = new Vec2(newX, newY);

    return result;
  }

  transpose() {
    const c00 = this.m00;
    const c01 = this.m10;
    const c02 = this.m20;
    const c10 = this.m01;
    const c11 = this.m11;
    const c12 = this.m21;
    const c20 = this.m02;
    const c21 = this.m12;
    const c22 = this.m22;

    // prettier-ignore
    const result = new Mat3(
      c00, c01, c02, 
      c10, c11, c12, 
      c20, c21, c22
    );

    return result;
  }

  determinant() {
    const determinant =
      this.m00 * (this.m11 * this.m22 - this.m12 * this.m21) -
      this.m01 * (this.m10 * this.m22 - this.m12 * this.m20) +
      this.m02 * (this.m10 * this.m21 - this.m11 * this.m20);

    return determinant;
  }

  equalsApprox(mat: Mat3) {
    return (
      Math.abs(this.m00 - mat.m00) <= EPSILON &&
      Math.abs(this.m01 - mat.m01) <= EPSILON &&
      Math.abs(this.m02 - mat.m02) <= EPSILON &&
      Math.abs(this.m10 - mat.m10) <= EPSILON &&
      Math.abs(this.m11 - mat.m11) <= EPSILON &&
      Math.abs(this.m12 - mat.m12) <= EPSILON &&
      Math.abs(this.m20 - mat.m20) <= EPSILON &&
      Math.abs(this.m21 - mat.m21) <= EPSILON &&
      Math.abs(this.m22 - mat.m22) <= EPSILON
    );
  }

  inverse() {
    const determinant = this.determinant();
    if (Math.abs(determinant) <= EPSILON) {
      throw new Error('Matrix is not invertible');
    }

    const minors = {
      m00: this.m11 * this.m22 - this.m12 * this.m21,
      m01: this.m10 * this.m22 - this.m12 * this.m20,
      m02: this.m10 * this.m21 - this.m11 * this.m20,
      m10: this.m01 * this.m22 - this.m02 * this.m21,
      m11: this.m00 * this.m22 - this.m02 * this.m20,
      m12: this.m00 * this.m21 - this.m01 * this.m20,
      m20: this.m01 * this.m12 - this.m02 * this.m11,
      m21: this.m00 * this.m12 - this.m02 * this.m10,
      m22: this.m00 * this.m11 - this.m01 * this.m10,
    };

    const cofactors = {
      m00: minors.m00,
      m01: -minors.m01,
      m02: minors.m02,
      m10: -minors.m10,
      m11: minors.m11,
      m12: -minors.m12,
      m20: minors.m20,
      m21: -minors.m21,
      m22: minors.m22,
    };

    const cofactorMatrix = new Mat3(
      cofactors.m00,
      cofactors.m01,
      cofactors.m02,
      cofactors.m10,
      cofactors.m11,
      cofactors.m12,
      cofactors.m20,
      cofactors.m21,
      cofactors.m22
    );

    const adjugate = cofactorMatrix.transpose();

    const c00 = adjugate.m00 / determinant;
    const c01 = adjugate.m01 / determinant;
    const c02 = adjugate.m02 / determinant;
    const c10 = adjugate.m10 / determinant;
    const c11 = adjugate.m11 / determinant;
    const c12 = adjugate.m12 / determinant;
    const c20 = adjugate.m20 / determinant;
    const c21 = adjugate.m21 / determinant;
    const c22 = adjugate.m22 / determinant;

    const result = new Mat3(c00, c01, c02, c10, c11, c12, c20, c21, c22);

    return result;
  }

  static identity() {
    // prettier-ignore
    return new Mat3(
        1, 0, 0, 
        0, 1, 0, 
        0, 0, 1
    );
  }

  static translation(tx: number, ty: number) {
    // prettier-ignore
    const result = new Mat3(
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1
    );

    return result;
  }

  static rotate(angle: number) {
    const c00 = Math.cos(angle);
    const c01 = Math.sin(angle);
    const c02 = 0;
    const c10 = -Math.sin(angle);
    const c11 = Math.cos(angle);
    const c12 = 0;
    const c20 = 0;
    const c21 = 0;
    const c22 = 1;

    // prettier-ignore
    const result = new Mat3(
      c00, c01, c02, 
      c10, c11, c12, 
      c20, c21, c22
    );

    return result;
  }

  static scale(scaleX: number, scaleY: number) {
    const c00 = scaleX;
    const c01 = 0;
    const c02 = 0;
    const c10 = 0;
    const c11 = scaleY;
    const c12 = 0;
    const c20 = 0;
    const c21 = 0;
    const c22 = 1;

    // prettier-ignore
    const result = new Mat3(
      c00, c01, c02, 
      c10, c11, c12, 
      c20, c21, c22
    );

    return result;
  }

  static fromMat2(mat2: Mat2) {
    // prettier-ignore
    const result = new Mat3(
      mat2.m00, mat2.m01, 0,
      mat2.m10, mat2.m11, 0,
      0, 0, 1
    );

    return result;
  }
}
