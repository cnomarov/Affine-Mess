import { Vec2 } from '../math';
import { Mesh2D, Node2D, Transform2D } from '../scene';
import type { ScreenPoint } from '../types';
import { drawLine } from '../renderer';
import { Vec2ToScreenPoint } from '../utils';

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

const grandChildTransform = new Transform2D(
  new Vec2(2, 0),
  0,
  new Vec2(0.7, 0.7),
  new Vec2(0, 0)
);

const parentNode = new Node2D(parentTransform, rectangleMesh);
const childNode = new Node2D(childTransform, rectangleMesh);
const grandChildNode = new Node2D(grandChildTransform, rectangleMesh);

parentNode.addChild(childNode);
childNode.addChild(grandChildNode);

window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'q')
    parentNode.transform.rotation =
      parentNode.transform.rotation + Math.PI / 36;

  if (event.key.toLowerCase() === 'e')
    parentNode.transform.rotation =
      parentNode.transform.rotation - Math.PI / 36;

  if (event.key.toLowerCase() === 'a')
    childNode.transform.rotation = childNode.transform.rotation + Math.PI / 36;

  if (event.key.toLowerCase() === 'd')
    childNode.transform.rotation = childNode.transform.rotation - Math.PI / 36;

  if (event.key.toLowerCase() === 'r') {
    parentNode.transform.rotation = 0;
    childNode.transform.rotation = 0;
  }
});

const colors = ['blue', 'green', 'purple'];

export function renderHierarchyDemo(ctx: CanvasRenderingContext2D) {
  let colorIndex = 0;
  parentNode.traverse((node) => {
    const nodeWorldMatrix = node.getWorldMatrix();
    const nodeMesh = node.mesh;

    if (!nodeMesh) return;

    const nodeWorldVertices = nodeMesh.vertices.map((vertex) => {
      return nodeWorldMatrix.transformPoint(vertex);
    });

    for (const edge of nodeMesh.edges) {
      const fromIndex = edge[0];
      const toIndex = edge[1];

      const fromVec = nodeWorldVertices[fromIndex];
      const toVec = nodeWorldVertices[toIndex];

      const fromPoint = Vec2ToScreenPoint(origin, fromVec, pixelsPerUnit);
      const toPoint = Vec2ToScreenPoint(origin, toVec, pixelsPerUnit);

      drawLine(ctx, fromPoint, toPoint, colors[colorIndex]);
    }
    colorIndex++;
  });
}
