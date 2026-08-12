import { Mesh2D } from './Mesh2D';
import { Transform2D } from './Transform2D';

export class Node2D {
  transform: Transform2D;
  mesh: Mesh2D | null;

  constructor(transform: Transform2D, mesh: Mesh2D | null) {
    this.transform = transform;
    this.mesh = mesh;
  }
}
