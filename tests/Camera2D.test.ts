import { expect, test } from '@jest/globals';
import { Camera2D, Vec2, Mat3 } from '../src';

test('Camera2D position, rotation, zoom', () => {
  const position = new Vec2(1, 1);
  const rotation = 0;
  const zoom = 1;

  const camera = new Camera2D(position, rotation, zoom);

  expect(camera.position).toBe(position);
  expect(camera.rotation).toBe(rotation);
  expect(camera.zoom).toBe(zoom);
});

test('Camera2D method getWorldMatrix', () => {
  const position = new Vec2(3, 2);
  const rotation = 0;
  const zoom = 1;

  const camera = new Camera2D(position, rotation, zoom);

  const worldMatrix = camera.getWorldMatrix();

  expect(worldMatrix).toEqual(new Mat3(1, 0, 0, 0, 1, 0, 3, 2, 1));
});

test('Camera2D method getWorldMatrix with a local camera point', () => {
  const position = new Vec2(3, 2);
  const rotation = Math.PI / 2;
  const zoom = 1;
  const localCameraPoint = new Vec2(1, 0);

  const camera = new Camera2D(position, rotation, zoom);

  const worldMatrix = camera.getWorldMatrix();

  expect(
    worldMatrix.transformPoint(localCameraPoint).equalsApprox(new Vec2(3, 3))
  ).toBe(true);
});

test('Camera2D method getViewMatrix', () => {
  const position = new Vec2(3, 2);
  const rotation = 0;
  const zoom = 1;

  const camera = new Camera2D(position, rotation, zoom);

  const viewMatrix = camera.getViewMatrix();

  expect(viewMatrix.transformPoint(position).equalsApprox(new Vec2(0, 0))).toBe(
    true
  );
});

test('Camera2D method getViewMatrix with a world point', () => {
  const position = new Vec2(3, 2);
  const rotation = Math.PI / 2;
  const zoom = 1;
  const worldPoint = new Vec2(3, 3);

  const camera = new Camera2D(position, rotation, zoom);

  const viewMatrix = camera.getViewMatrix();

  expect(
    viewMatrix.transformPoint(worldPoint).equalsApprox(new Vec2(1, 0))
  ).toBe(true);
});

test('Camera2D method getZoomMatrix', () => {
  const position = new Vec2(3, 2);
  const rotation = Math.PI / 2;
  const zoom = 2;
  const cameraSpacePoint = new Vec2(2, 1);

  const camera = new Camera2D(position, rotation, zoom);
  const zoomMatrix = camera.getZoomMatrix();

  expect(
    zoomMatrix.transformPoint(cameraSpacePoint).equalsApprox(new Vec2(4, 2))
  ).toBe(true);
});

test('Camera2D method getViewZoomMatrix', () => {
  const position = new Vec2(3, 2);
  const rotation = 0;
  const zoom = 2;
  const worldPoint = new Vec2(4, 3);

  const camera = new Camera2D(position, rotation, zoom);

  const viewZoomMatrix = camera.getViewZoomMatrix();

  expect(
    viewZoomMatrix.transformPoint(worldPoint).equalsApprox(new Vec2(2, 2))
  ).toBe(true);
});
