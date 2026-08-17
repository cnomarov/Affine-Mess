import { Mat3, Vec2 } from '../math';

export class Camera2D {
  position: Vec2;
  rotation: number;
  zoom: number;

  constructor(position: Vec2, rotation: number, zoom: number) {
    this.position = position;
    this.rotation = rotation;
    this.zoom = zoom;
  }

  getWorldMatrix() {
    const translationMatrix = Mat3.translation(
      this.position.x,
      this.position.y
    );
    const rotationMatrix = Mat3.rotate(this.rotation);

    const result = rotationMatrix.multiply(translationMatrix);

    return result;
  }

  getViewMatrix() {
    const worldMatrix = this.getWorldMatrix();
    const result = worldMatrix.inverse();

    return result;
  }

  getZoomMatrix() {
    const scaleMatrix = Mat3.scale(this.zoom, this.zoom);

    return scaleMatrix;
  }

  getViewZoomMatrix() {
    const viewMatrix = this.getViewMatrix();
    const zoomMatrix = this.getZoomMatrix();

    const result = viewMatrix.multiply(zoomMatrix);

    return result;
  }
}
