import { Mesh2D } from './Mesh2D';
import { Transform2D } from './Transform2D';

export class Node2D {
  transform: Transform2D;
  mesh: Mesh2D | null;
  parent: Node2D | null;
  children: Set<Node2D>;

  constructor(transform: Transform2D, mesh: Mesh2D | null) {
    this.transform = transform;
    this.mesh = mesh;
    this.parent = null;
    this.children = new Set<Node2D>();
  }

  addChild(child: Node2D) {
    let ancestor: Node2D | null = this;

    if (child === this) throw new Error('Node cannot be a child of itself');

    if (this.children.has(child))
      throw new Error('Child can only be added once');

    while (ancestor) {
      if (ancestor === child)
        throw new Error('Cannot create a cycle in the scene graph');

      ancestor = ancestor.parent;
    }

    if (child.parent) throw new Error('Child already has a parent');

    this.children.add(child);

    child.parent = this;
  }

  removeChild(child: Node2D) {
    if (!this.children.has(child))
      throw new Error('Node is not a child of this parent');

    this.children.delete(child);
    child.parent = null;
  }

  getWorldMatrix() {
    const localMatrix = this.transform.getLocalMatrix();

    if (!this.parent) return localMatrix;

    const worldMatrix = localMatrix.multiply(this.parent.getWorldMatrix());
    return worldMatrix;
  }

  traverse(action: (node: Node2D) => void): void {
    action(this);

    for (const child of this.children) {
      child.traverse(action);
    }
  }
}
