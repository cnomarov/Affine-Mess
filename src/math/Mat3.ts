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

  static identity() {
    // prettier-ignore
    return new Mat3(
        1, 0, 0, 
        0, 1, 0, 
        0, 0, 1
    );
  }
}
