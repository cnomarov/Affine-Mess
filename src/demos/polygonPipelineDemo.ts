import { Mat3, Vec2 } from '../math';
import type { ScreenPoint } from '../types';
import { Vec2ToScreenPoint } from '../utils';
import { drawLine, drawText } from '../renderer';
import { Mesh2D, Node2D, Transform2D } from '../scene';

const squareVertices: Vec2[] = [
  new Vec2(-1, -1),
  new Vec2(1, -1),
  new Vec2(1, 1),
  new Vec2(-1, 1),
];

const squareEdges: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
];

const squareMesh = new Mesh2D(squareVertices, squareEdges);

const origin: ScreenPoint = {
  x: 180,
  y: 250,
};

const pixelsPerUnit = 70;

const transform = new Transform2D(
  new Vec2(2, 1),
  Math.PI / 6,
  new Vec2(1.5, 0.75),
  new Vec2(0, 0)
);

const squareNode = new Node2D(transform, squareMesh);

window.addEventListener('keydown', (event) => {
  const step = 0.2;

  if (event.key === 'ArrowLeft')
    squareNode.transform.position = new Vec2(
      squareNode.transform.position.x - step,
      squareNode.transform.position.y
    );

  if (event.key === 'ArrowRight')
    squareNode.transform.position = new Vec2(
      squareNode.transform.position.x + step,
      squareNode.transform.position.y
    );
  if (event.key === 'ArrowUp')
    squareNode.transform.position = new Vec2(
      squareNode.transform.position.x,
      squareNode.transform.position.y + step
    );

  if (event.key === 'ArrowDown')
    squareNode.transform.position = new Vec2(
      squareNode.transform.position.x,
      squareNode.transform.position.y - step
    );
  if (event.key.toLowerCase() === 'q')
    squareNode.transform.rotation = squareNode.transform.rotation + Math.PI / 36;

  if (event.key.toLowerCase() === 'e')
    squareNode.transform.rotation = squareNode.transform.rotation - Math.PI / 36;
  if (event.key === '+')
    squareNode.transform.scale = squareNode.transform.scale.multiplyScalar(1.1);

  if (event.key === '-') {
    const nextScale = squareNode.transform.scale.multiplyScalar(0.9);

    if (nextScale.x >= 0.1 && nextScale.y >= 0.1) {
      squareNode.transform.scale = nextScale;
    }
  }

  if (event.key.toLowerCase() === 'r') {
    squareNode.transform.position = new Vec2(2, 1);
    squareNode.transform.rotation = Math.PI / 6;
    squareNode.transform.scale = new Vec2(1.5, 0.75);
  }
});

export function renderPolygonPipelineDemo(ctx: CanvasRenderingContext2D) {
  const scaleMatrix = Mat3.scale(
    squareNode.transform.scale.x,
    squareNode.transform.scale.y
  );
  const rotationMatrix = Mat3.rotate(squareNode.transform.rotation);

  const scaleThenRotationMatrix = squareNode.transform.getLocalMatrix();

  const rotationThenScaleMatrix = rotationMatrix
    .multiply(scaleMatrix)
    .multiply(
      Mat3.translation(
        squareNode.transform.position.x + 5,
        squareNode.transform.position.y
      )
    );

  const mesh = squareNode.mesh;

  if (!mesh) {
    return;
  }

  const scaleThenRotationVertices = mesh.vertices.map((vertex) => {
    return scaleThenRotationMatrix.transformPoint(vertex);
  });

  const rotationThenScaleVertices = mesh.vertices.map((vertex) => {
    return rotationThenScaleMatrix.transformPoint(vertex);
  });

  for (const squareEdge of mesh.edges) {
    const fromIndex = squareEdge[0];
    const toIndex = squareEdge[1];

    const fromVec = mesh.vertices[fromIndex];
    const toVec = mesh.vertices[toIndex];

    const fromPoint = Vec2ToScreenPoint(origin, fromVec, pixelsPerUnit);
    const toPoint = Vec2ToScreenPoint(origin, toVec, pixelsPerUnit);

    drawLine(ctx, fromPoint, toPoint);
  }

  for (const squareEdge of mesh.edges) {
    const fromIndex = squareEdge[0];
    const toIndex = squareEdge[1];

    const fromVec = scaleThenRotationVertices[fromIndex];
    const toVec = scaleThenRotationVertices[toIndex];

    const fromPoint = Vec2ToScreenPoint(origin, fromVec, pixelsPerUnit);
    const toPoint = Vec2ToScreenPoint(origin, toVec, pixelsPerUnit);

    drawLine(ctx, fromPoint, toPoint, 'green');
  }

  for (const squareEdge of mesh.edges) {
    const fromIndex = squareEdge[0];
    const toIndex = squareEdge[1];

    const fromVec = rotationThenScaleVertices[fromIndex];
    const toVec = rotationThenScaleVertices[toIndex];

    const fromPoint = Vec2ToScreenPoint(origin, fromVec, pixelsPerUnit);
    const toPoint = Vec2ToScreenPoint(origin, toVec, pixelsPerUnit);

    drawLine(ctx, fromPoint, toPoint, 'purple');
  }

  const firstLabelPoint = Vec2ToScreenPoint(
    origin,
    new Vec2(
      squareNode.transform.position.x - 1.5,
      squareNode.transform.position.y + 2
    ),
    pixelsPerUnit
  );
  const secondLabelPoint = Vec2ToScreenPoint(
    origin,
    new Vec2(
      squareNode.transform.position.x + 3.5,
      squareNode.transform.position.y + 2
    ),
    pixelsPerUnit
  );

  drawText(ctx, 'scale -> rotation', firstLabelPoint, 'green');
  drawText(ctx, 'rotation -> scale', secondLabelPoint, 'purple');
}
