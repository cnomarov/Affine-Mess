import { Vec2 } from '../math/Vec2';
import { type Edge } from '../types';

export class Mesh2D {
  readonly vertices: ReadonlyArray<Vec2>;
  readonly edges: ReadonlyArray<Edge>;

  constructor(vertices: Vec2[], edges: Edge[]) {
    this.vertices = [...vertices];
    this.edges = [...edges];
  }
}
