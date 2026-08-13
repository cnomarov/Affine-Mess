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
  expect(node.parent).toBe(null);
  expect(node.children).toEqual(new Set<Node2D>());
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

test('Node2D method addChild', () => {
  const transformParent = new Transform2D(
    new Vec2(3, 2),
    0,
    new Vec2(1, 1),
    new Vec2(0, 0)
  );

  const transformChild = new Transform2D(
    new Vec2(2, 1),
    0,
    new Vec2(1, 1),
    new Vec2(0, 0)
  );

  const nodeParent = new Node2D(transformParent, null);
  const nodeChild = new Node2D(transformChild, null);

  nodeParent.addChild(nodeChild);

  expect(nodeParent.children.has(nodeChild)).toBe(true);
  expect(nodeChild.parent).toBe(nodeParent);
});

test('Node2D method addChild with error', () => {
  const transformParent = new Transform2D(
    new Vec2(3, 2),
    0,
    new Vec2(1, 1),
    new Vec2(0, 0)
  );

  const nodeParent = new Node2D(transformParent, null);
  expect(() => nodeParent.addChild(nodeParent)).toThrow(
    'parent cannot be a child to itself'
  );
  expect(nodeParent.children).toEqual(new Set<Node2D>());
  expect(nodeParent.parent).toBe(null);
});

test('Node2D method addChild duplicate', () => {
  const transformParent = new Transform2D(
    new Vec2(3, 2),
    0,
    new Vec2(1, 1),
    new Vec2(0, 0)
  );

  const transformChild = new Transform2D(
    new Vec2(2, 1),
    0,
    new Vec2(1, 1),
    new Vec2(0, 0)
  );

  const nodeParent = new Node2D(transformParent, null);
  const nodeChild = new Node2D(transformChild, null);

  nodeParent.addChild(nodeChild);
  expect(() => nodeParent.addChild(nodeChild)).toThrow(
    'child can only be added once'
  );
  expect(nodeParent.children.size).toBe(1);
  expect(nodeParent.children.has(nodeChild)).toBe(true);
  expect(nodeChild.parent).toBe(nodeParent);
});

test('Node2D method addChild rejects a second parent', () => {
  const transformParent = new Transform2D(
    new Vec2(3, 2),
    0,
    new Vec2(1, 1),
    new Vec2(0, 0)
  );

  const transformChild = new Transform2D(
    new Vec2(2, 1),
    0,
    new Vec2(1, 1),
    new Vec2(0, 0)
  );

  const nodeParent = new Node2D(transformParent, null);
  const nodeParent2 = new Node2D(transformParent, null);
  const nodeChild = new Node2D(transformChild, null);

  nodeParent.addChild(nodeChild);
  expect(() => nodeParent2.addChild(nodeChild)).toThrow(
    'child already has parent'
  );
  expect(nodeParent.children.has(nodeChild)).toBe(true);
  expect(nodeParent.children.size).toBe(1);
  expect(nodeParent2.children.has(nodeChild)).toBe(false);
  expect(nodeParent2.children.size).toBe(0);
  expect(nodeChild.parent).toBe(nodeParent);
});

test('Node2D method addChild rejects a cycle', () => {
  const transform = new Transform2D(
    new Vec2(3, 2),
    0,
    new Vec2(1, 1),
    new Vec2(0, 0)
  );

  const nodeA = new Node2D(transform, null);
  const nodeB = new Node2D(transform, null);
  const nodeC = new Node2D(transform, null);
  const nodeD = new Node2D(transform, null);

  nodeA.addChild(nodeB);
  nodeB.addChild(nodeC);
  nodeC.addChild(nodeD);

  expect(() => nodeD.addChild(nodeA)).toThrow(
    'children of child cannot be parent of parent'
  );

  expect(nodeA.parent).toBeNull();
  expect(nodeB.parent).toBe(nodeA);
  expect(nodeC.parent).toBe(nodeB);
  expect(nodeD.parent).toBe(nodeC);
  expect(nodeA.children.has(nodeB)).toBe(true);
  expect(nodeA.children.size).toBe(1);
  expect(nodeB.children.has(nodeC)).toBe(true);
  expect(nodeB.children.size).toBe(1);
  expect(nodeC.children.has(nodeD)).toBe(true);
  expect(nodeC.children.size).toBe(1);
  expect(nodeD.children.size).toBe(0);
});
