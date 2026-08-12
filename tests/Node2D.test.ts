import { expect, test } from '@jest/globals';
import { Transform2D, Vec2, Mesh2D, Node2D } from '../src';

test('Node2D initialization', () => {
  const position = new Vec2(3, 2);
  const rotation = 0;
  const scale = new Vec2(1, 1);
  const pivot = new Vec2(0, 0);
  const transform = new Transform2D(position, rotation, scale, pivot);

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

  const mesh = new Mesh2D(squareVertices, squareEdges);

  const node = new Node2D(transform, mesh);

  expect(node.transform).toBe(transform);
  expect(node.mesh).toBe(mesh);
});

test('Node2D can exist without a mesh', () => {
  const transform = new Transform2D(
    new Vec2(3, 2),
    0,
    new Vec2(1, 1),
    new Vec2(0, 0)
  );

  const node = new Node2D(transform, null);

  expect(node.transform).toBe(transform);
  expect(node.mesh).toBeNull();
});
