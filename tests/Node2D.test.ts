import { expect, test } from '@jest/globals';
import { Transform2D, Vec2, Mesh2D, Node2D, Mat3 } from '../src';

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

test('Node2D method removeChild', () => {
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
  expect(nodeParent.children.size).toBe(1);
  expect(nodeParent.children.has(nodeChild)).toBe(true);
  expect(nodeChild.parent).toBe(nodeParent);

  nodeParent.removeChild(nodeChild);
  expect(nodeParent.children.size).toBe(0);
  expect(nodeParent.children.has(nodeChild)).toBe(false);
  expect(nodeChild.parent).toBe(null);
});

test('Node2D method removeChild rejects a node that is not a child', () => {
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

  nodeParent2.addChild(nodeChild);
  expect(() => nodeParent.removeChild(nodeChild)).toThrow(
    'parent does not have this child'
  );
  expect(nodeParent2.children.has(nodeChild)).toBe(true);
  expect(nodeParent2.children.size).toBe(1);
  expect(nodeParent.children.has(nodeChild)).toBe(false);
  expect(nodeParent.children.size).toBe(0);
  expect(nodeChild.parent).toBe(nodeParent2);
});

test('Node2D method getWorldMatrix', () => {
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
  const worldMatrix = nodeChild.getWorldMatrix();

  expect(worldMatrix).toEqual(new Mat3(1, 0, 0, 0, 1, 0, 5, 3, 1));
});

test('Node2D root world matrix equals its local matrix', () => {
  const transform = new Transform2D(
    new Vec2(3, 2),
    0,
    new Vec2(1, 1),
    new Vec2(0, 0)
  );
  const node = new Node2D(transform, null);

  expect(node.getWorldMatrix().equalsApprox(transform.getLocalMatrix())).toBe(
    true
  );
});

test('Node2D world matrix includes the full parent chain', () => {
  const nodeA = new Node2D(
    new Transform2D(new Vec2(3, 2), 0, new Vec2(1, 1), new Vec2(0, 0)),
    null
  );
  const nodeB = new Node2D(
    new Transform2D(new Vec2(2, 1), 0, new Vec2(1, 1), new Vec2(0, 0)),
    null
  );
  const nodeC = new Node2D(
    new Transform2D(new Vec2(4, -2), 0, new Vec2(1, 1), new Vec2(0, 0)),
    null
  );

  nodeA.addChild(nodeB);
  nodeB.addChild(nodeC);

  expect(
    nodeC.getWorldMatrix().equalsApprox(new Mat3(1, 0, 0, 0, 1, 0, 9, 1, 1))
  ).toBe(true);
});

test('Node2D world matrix applies child transform before parent transform', () => {
  const nodeA = new Node2D(
    new Transform2D(
      new Vec2(3, 2),
      Math.PI / 2,
      new Vec2(1, 1),
      new Vec2(0, 0)
    ),
    null
  );
  const nodeB = new Node2D(
    new Transform2D(new Vec2(2, 0), 0, new Vec2(1, 1), new Vec2(0, 0)),
    null
  );

  nodeA.addChild(nodeB);
  const childWorldMatrix = nodeB.getWorldMatrix();

  expect(
    childWorldMatrix.equalsApprox(new Mat3(0, 1, 0, -1, 0, 0, 3, 4, 1))
  ).toBe(true);
});

test('Node2D method traverse', () => {
  const transform = new Transform2D(
    new Vec2(3, 2),
    0,
    new Vec2(1, 1),
    new Vec2(0, 0)
  );

  const parent = new Node2D(transform, null);
  const child = new Node2D(transform, null);
  const grandchild = new Node2D(transform, null);

  parent.addChild(child);
  child.addChild(grandchild);

  const visited: Node2D[] = [];

  parent.traverse((node) => {
    visited.push(node);
  });

  expect(visited).toEqual([parent, child, grandchild]);
});
