import { Mat3, Vec2 } from '../math';

export class Transform2D {
  position: Vec2;
  rotation: number;
  scale: Vec2;
  pivot: Vec2;

  constructor(position: Vec2, rotation: number, scale: Vec2, pivot: Vec2) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.pivot = pivot;
  }

  getLocalMatrix(): Mat3 {
    const pivotMatrix = Mat3.translation(-this.pivot.x, -this.pivot.y);
    const scaleMatrix = Mat3.scale(this.scale.x, this.scale.y);
    const rotationMatrix = Mat3.rotate(this.rotation);
    const translationMatrix = Mat3.translation(
      this.position.x,
      this.position.y
    );

    const result = pivotMatrix.multiply(
      scaleMatrix.multiply(rotationMatrix.multiply(translationMatrix))
    );

    return result;
  }
}
