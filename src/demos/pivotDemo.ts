import { Vec2 } from '../math';
import { drawLine, drawPoint, drawText } from '../renderer';
import { Mesh2D, Node2D, Transform2D } from '../scene';
import type { ScreenPoint } from '../types';
import { Vec2ToScreenPoint } from '../utils';

const doorVertices: Vec2[] = [
  new Vec2(-1, -1),
  new Vec2(1, -1),
  new Vec2(1, 1),
  new Vec2(-1, 1),
];

const doorEdges: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
];

const doorMesh = new Mesh2D(doorVertices, doorEdges);

const screenOrigin: ScreenPoint = {
  x: 350,
  y: 250,
};

const pixelsPerUnit = 70;
const initialRotation = 0;

const doorTransform = new Transform2D(
  new Vec2(0, 0),
  initialRotation,
  new Vec2(1, 1),
  new Vec2(-1, 0)
);

const doorNode = new Node2D(doorTransform, doorMesh);

window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'q') {
    doorNode.transform.rotation += Math.PI / 36;
  }

  if (event.key.toLowerCase() === 'e') {
    doorNode.transform.rotation -= Math.PI / 36;
  }

  if (event.key.toLowerCase() === 'r') {
    doorNode.transform.rotation = initialRotation;
    doorNode.transform.pivot = new Vec2(-1, 0);
  }

  if (event.key === '1') {
    doorNode.transform.pivot = new Vec2(0, 0);
  }

  if (event.key === '2') {
    doorNode.transform.pivot = new Vec2(-1, 0);
  }

  if (event.key === '3') {
    doorNode.transform.pivot = new Vec2(-1, -1);
  }

  if (event.key === '4') {
    doorNode.transform.pivot = new Vec2(-2, 0);
  }
});

export function renderPivotDemo(ctx: CanvasRenderingContext2D): void {
  const localMatrix = doorNode.transform.getLocalMatrix();

  const mesh = doorNode.mesh;

  if (!mesh) {
    return;
  }
  const transformedVertices = mesh.vertices.map((vertex) => {
    return localMatrix.transformPoint(vertex);
  });

  for (const [fromIndex, toIndex] of mesh.edges) {
    const fromPoint = Vec2ToScreenPoint(
      screenOrigin,
      transformedVertices[fromIndex],
      pixelsPerUnit
    );
    const toPoint = Vec2ToScreenPoint(
      screenOrigin,
      transformedVertices[toIndex],
      pixelsPerUnit
    );

    drawLine(ctx, fromPoint, toPoint, 'green');
  }

  const pivotScreenPoint = Vec2ToScreenPoint(
    screenOrigin,
    doorNode.transform.position,
    pixelsPerUnit
  );

  drawPoint(ctx, pivotScreenPoint, 'red', 6);
  drawText(
    ctx,
    'pivot',
    { x: pivotScreenPoint.x + 10, y: pivotScreenPoint.y - 10 },
    'red'
  );
  drawText(
    ctx,
    'Q / E: rotate   R: reset   1: center   2: edge   3: corner   4: outside',
    { x: 20, y: 30 }
  );
}
