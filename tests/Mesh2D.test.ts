import { expect, test } from '@jest/globals';
import { Mesh2D, Vec2, Mat3 } from '../src';

test('Mesh2D stores local vertices and edges', () => {
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

  expect(mesh.vertices).not.toBe(squareVertices);
  expect(mesh.edges).not.toBe(squareEdges);
  expect(mesh.vertices).toEqual(squareVertices);
  expect(mesh.edges).toEqual(squareEdges);

  squareVertices[0] = new Vec2(10, 20);

  expect(squareVertices[0]).toEqual(new Vec2(10, 20));
  expect(mesh.vertices[0]).toEqual(new Vec2(-1, -1));
});

test('Mesh2D with a transformed vertex', () => {
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

  const tx = 3;
  const ty = 4;

  const mat = Mat3.translation(tx, ty);

  const mesh = new Mesh2D(squareVertices, squareEdges);

  const result = mat.transformPoint(mesh.vertices[0]);

  expect(result).not.toBe(mesh.vertices[0]);
  expect(result).toEqual(new Vec2(2, 3));
  expect(mesh.vertices[0]).toEqual(new Vec2(-1, -1));
});

test('Mesh2D can be shared', () => {
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

  const meshA = new Mesh2D(squareVertices, squareEdges);
  const meshB = meshA;

  expect(meshA).toBe(meshB);
});
