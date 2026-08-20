import { Vec2 } from '../math';
import { Mesh2D, Node2D, Transform2D } from '../scene';
import type { ScreenPoint } from '../types';
import { drawLine, drawText } from '../renderer';
import { Vec2ToScreenPoint, ScreenPointToVec2 } from '../utils';
import { Camera2D } from '../rendering';

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

const grandchildTransform = new Transform2D(
  new Vec2(2, 0),
  0,
  new Vec2(0.7, 0.7),
  new Vec2(0, 0)
);

const parentNode = new Node2D(parentTransform, rectangleMesh);
const childNode = new Node2D(childTransform, rectangleMesh);
const grandchildNode = new Node2D(grandchildTransform, rectangleMesh);

const cameraDetails = {
  position: new Vec2(0, 0),
  rotation: 0,
  zoom: 1,
};

const camera = new Camera2D(
  cameraDetails.position,
  cameraDetails.rotation,
  cameraDetails.zoom
);

parentNode.addChild(childNode);
childNode.addChild(grandchildNode);

window.addEventListener('keydown', (event) => {
  const step = 0.2;

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

  if (event.key === 'ArrowLeft')
    camera.position = new Vec2(camera.position.x - step, camera.position.y);

  if (event.key === 'ArrowRight')
    camera.position = new Vec2(camera.position.x + step, camera.position.y);

  if (event.key === 'ArrowUp')
    camera.position = new Vec2(camera.position.x, camera.position.y + step);

  if (event.key === 'ArrowDown')
    camera.position = new Vec2(camera.position.x, camera.position.y - step);

  if (event.key.toLowerCase() === 'z')
    camera.rotation = camera.rotation + Math.PI / 36;

  if (event.key.toLowerCase() === 'x')
    camera.rotation = camera.rotation - Math.PI / 36;

  if (event.key === '+') camera.zoom = camera.zoom * 1.1;

  if (event.key === '-') camera.zoom = Math.max(0.1, camera.zoom / 1.1);

  if (event.key.toLowerCase() === 'r') {
    parentNode.transform.rotation = 0;
    childNode.transform.rotation = 0;
    camera.position = new Vec2(0, 0);
    camera.rotation = 0;
    camera.zoom = 1;
  }
});

const colors = ['blue', 'green', 'purple'];

let isChildSelected = false;
let wasMousePressed = false;

export function renderHierarchyDemo(
  ctx: CanvasRenderingContext2D,
  mouseScreenPoint: ScreenPoint,
  isMousePressed: boolean
) {
  const mouseCameraZoomPoint = ScreenPointToVec2(
    origin,
    mouseScreenPoint,
    pixelsPerUnit
  );

  let colorIndex = 0;
  const viewZoomMatrix = camera.getViewZoomMatrix();
  const inverseViewZoomMatrix = viewZoomMatrix.inverse();
  const mouseWorldPoint =
    inverseViewZoomMatrix.transformPoint(mouseCameraZoomPoint);

  const inverseChildWorldMatrix = childNode.getWorldMatrix().inverse();
  const mouseChildLocalPoint =
    inverseChildWorldMatrix.transformPoint(mouseWorldPoint);

  const isChildHovered =
    mouseChildLocalPoint.x >= 0 &&
    mouseChildLocalPoint.x <= 2 &&
    mouseChildLocalPoint.y >= 0 &&
    mouseChildLocalPoint.y <= 1;

  const mouseJustPressed = isMousePressed && !wasMousePressed;
  if (mouseJustPressed) isChildSelected = isChildHovered;
  wasMousePressed = isMousePressed;

  parentNode.traverse((node) => {
    const nodeWorldMatrix = node.getWorldMatrix();
    const nodeMesh = node.mesh;

    if (!nodeMesh) return;

    const nodeWorldVertices = nodeMesh.vertices.map((vertex) => {
      return nodeWorldMatrix.transformPoint(vertex);
    });

    const nodeColor =
      node === childNode && isChildSelected
        ? 'red'
        : node === childNode && isChildHovered
          ? 'orange'
          : colors[colorIndex];

    for (const edge of nodeMesh.edges) {
      const fromIndex = edge[0];
      const toIndex = edge[1];

      const fromVec = nodeWorldVertices[fromIndex];
      const toVec = nodeWorldVertices[toIndex];

      const fromCameraPoint = viewZoomMatrix.transformPoint(fromVec);
      const toCameraPoint = viewZoomMatrix.transformPoint(toVec);

      const fromPoint = Vec2ToScreenPoint(
        origin,
        fromCameraPoint,
        pixelsPerUnit
      );
      const toPoint = Vec2ToScreenPoint(origin, toCameraPoint, pixelsPerUnit);

      drawLine(ctx, fromPoint, toPoint, nodeColor);
    }
    colorIndex++;
  });

  drawText(ctx, 'Q/E: parent   A/D: child   Arrows: camera position', {
    x: 20,
    y: 30,
  });
  drawText(
    ctx,
    `Z/X: camera rotation   +/-: zoom   R: reset   Zoom: ${camera.zoom.toFixed(2)}`,
    { x: 20, y: 55 }
  );
  drawText(
    ctx,
    `mouseWorldPoint: (${mouseWorldPoint.x.toFixed(2)}, ${mouseWorldPoint.y.toFixed(2)})`,
    {
      x: 20,
      y: 100,
    }
  );
  drawText(
    ctx,
    `local child point: (${mouseChildLocalPoint.x.toFixed(2)}, ${mouseChildLocalPoint.y.toFixed(2)})`,
    {
      x: 20,
      y: 120,
    }
  );
  drawText(ctx, `isChildHovered: ${isChildHovered}`, {
    x: 20,
    y: 140,
  });
  drawText(ctx, `isChildSelected: ${isChildSelected}`, {
    x: 20,
    y: 160,
  });
}
