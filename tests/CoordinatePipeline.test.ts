import { expect, test } from '@jest/globals';
import type { ScreenPoint } from '../src/types';
import {
  Vec2,
  Camera2D,
  Transform2D,
  Node2D,
  Mesh2D,
  ScreenPointToVec2,
  Vec2ToScreenPoint,
} from '../src';

test('Coordinate Pipeline', () => {
  const childLocalPoint = new Vec2(1, 0.5);

  const origin: ScreenPoint = {
    x: 300,
    y: 300,
  };

  const pixelsPerUnit = 70;

  const parentTransform = new Transform2D(
    new Vec2(0, 0),
    0,
    new Vec2(1.5, 0.5),
    new Vec2(0, 0)
  );

  const childTransform = new Transform2D(
    new Vec2(2, 0),
    0,
    new Vec2(1, 0.35),
    new Vec2(0, 0)
  );

  const rectangleVertices: Vec2[] = [
    new Vec2(0, 0),
    new Vec2(2, 0),
    new Vec2(2, 1),
    new Vec2(0, 1),
  ];

  const rectangleEdges: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 0],
  ];

  const rectangleMesh = new Mesh2D(rectangleVertices, rectangleEdges);

  const parentNode = new Node2D(parentTransform, rectangleMesh);
  const childNode = new Node2D(childTransform, rectangleMesh);

  parentNode.addChild(childNode);

  const cameraDetails = {
    position: new Vec2(-2, 1),
    rotation: Math.PI / 6,
    zoom: 1.5,
  };

  const camera = new Camera2D(
    cameraDetails.position,
    cameraDetails.rotation,
    cameraDetails.zoom
  );

  const childWorldMatrix = childNode.getWorldMatrix();
  const inverseChildMatrix = childWorldMatrix.inverse();
  const childWorldPoint = childWorldMatrix.transformPoint(childLocalPoint);

  const viewZoomMatrix = camera.getViewZoomMatrix();
  const inverseCameraMatrix = viewZoomMatrix.inverse();

  const childCameraZoomPoint = viewZoomMatrix.transformPoint(childWorldPoint);

  const childScreenPoint = Vec2ToScreenPoint(
    origin,
    childCameraZoomPoint,
    pixelsPerUnit
  );

  const childVec = ScreenPointToVec2(origin, childScreenPoint, pixelsPerUnit);
  const result = inverseChildMatrix.transformPoint(
    inverseCameraMatrix.transformPoint(childVec)
  );

  expect(result.equalsApprox(childLocalPoint)).toBe(true);
});
