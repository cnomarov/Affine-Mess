# Affine Mess

> A tiny 2D engine where transformations work perfectly—until they don't.

**Affine Mess** is an educational 2D engine built from scratch with **TypeScript** and **HTML Canvas**.

The goal is not to compete with Unity, Godot, or any engine made by people who know what they are doing. The goal is to understand what actually happens when an object moves, rotates, scales, inherits a parent transform, enters camera space, and suddenly disappears because two matrices were multiplied in the wrong order.

No hidden transformation APIs.  
No `ctx.rotate()` saving the day.  
No matrix black boxes.

Every vertex must survive the journey manually.

---

## Why “Affine Mess”?

An **affine transformation** combines linear transformations—such as rotation, scaling, reflection, and shear—with translation.

*A fine mess* is what happens when the order is wrong.

In Affine Mess:

```text
Scale × Rotate ≠ Rotate × Scale
```

One order produces a properly transformed object.

The other launches it into mathematical exile.

---

## Project Goal

Affine Mess is a practical playground for learning the mathematics behind game-engine transformations.

Instead of memorizing formulas and immediately forgetting them, this project turns them into visible systems:

```text
local space
    ↓
parent space
    ↓
world space
    ↓
camera space
    ↓
screen space
```

By the end of the project, the engine should be able to:

- render custom 2D geometry;
- move, rotate, scale, reflect, shear, and project objects;
- rotate and scale around configurable pivots;
- combine transformations into a single matrix;
- manage parent-child transform hierarchies;
- convert points between local, world, camera, and screen spaces;
- move and rotate a 2D camera;
- convert mouse coordinates back into object-local space;
- visualize basis vectors, pivots, bounds, and matrices;
- prove that inverse transformations actually undo the original operation.

---

## The Prime Directive

Canvas is allowed to draw lines and fill polygons.

Canvas is **not** allowed to perform the engine’s mathematics.

The following shortcuts are forbidden inside the transformation pipeline:

```ts
ctx.translate(...)
ctx.rotate(...)
ctx.scale(...)
ctx.transform(...)
ctx.setTransform(...)
```

All geometry must be transformed using custom vector and matrix classes before it reaches the Canvas renderer.

Canvas receives final screen-space points and does what it is told.

---

## Mathematical Convention

Affine Mess follows the row-vector convention used by *3D Math Primer for Graphics and Game Development*:

```text
vector × matrix
```

That means:

- vectors are treated as row vectors;
- transformed basis axes are stored in matrix rows;
- transformations are applied from left to right;
- 2D translation is stored in the final row of a homogeneous `3×3` matrix.

Example:

```text
point × Scale × Rotation × Translation
```

means:

1. scale the point;
2. rotate the result;
3. translate the result.

Many graphics resources use column vectors and place translation in the last column. Affine Mess does not.

Mixing the two conventions is how portals to incorrect coordinate systems are opened.

---

## Core Systems

### `Vec2`

The basic 2D vector type.

Planned operations include:

- addition and subtraction;
- scalar multiplication;
- length and squared length;
- normalization;
- dot product;
- projection onto another vector;
- perpendicular vectors;
- approximate equality for floating-point calculations.

Vectors will represent:

- positions;
- directions;
- offsets;
- velocities;
- basis axes;
- local and world coordinates.

---

### `Mat2`

A `2×2` matrix representing linear transformations without translation.

It will support:

- identity;
- rotation;
- uniform and non-uniform scaling;
- scaling along an arbitrary axis;
- reflection;
- orthographic projection;
- horizontal and vertical shear;
- matrix multiplication;
- vector transformation;
- transpose;
- determinant;
- inverse.

A `Mat2` can rotate or destroy a square, but it cannot move the square away from the origin.

For that, the engine needs homogeneous coordinates.

---

### `Mat3`

The main transformation matrix of the engine.

A homogeneous `3×3` matrix can store an entire 2D affine transformation:

```text
| linear  linear  0 |
| linear  linear  0 |
|   tx      ty    1 |
```

It will support:

- translation;
- rotation;
- scaling;
- shear;
- reflection;
- projection;
- matrix composition;
- point transformation using `w = 1`;
- direction transformation using `w = 0`;
- determinant;
- transpose;
- inverse.

This distinction is essential:

```text
point     → affected by translation
direction → not affected by translation
```

A location can move.

“Forward” cannot be translated five metres to the left.

---

## Transform2D

Game objects should not require direct matrix construction every time they move.

`Transform2D` will expose understandable properties:

```text
position
rotation
scale
pivot
```

These values will be combined into a local transformation matrix.

The pivot defines the point around which rotation and scaling occur.

This allows the engine to model:

- a door rotating around its hinge;
- an arm rotating around its shoulder;
- a sword attached to a hand;
- a rectangle rotating around a corner;
- an object orbiting an external point.

The general idea is:

```text
move pivot to origin
→ transform
→ return pivot
```

---

## Scene Hierarchy

Objects will be represented by scene nodes.

Each node may contain:

- a local transform;
- drawable geometry;
- a parent;
- any number of children.

A child exists in its parent’s coordinate space.

```text
body
└── upper arm
    └── forearm
        └── hand
            └── sword
```

Rotating the shoulder should move the entire arm.

Rotating the hand should move only the hand and sword.

Removing the sword’s parent should cause an immediate existential crisis.

With row vectors, a child’s world matrix will be built in this order:

```text
child local matrix × parent world matrix
```

---

## Camera2D

The camera will have its own:

- position;
- rotation;
- zoom.

An object transform converts local coordinates into world coordinates.

A camera needs the opposite operation:

```text
world space → camera space
```

Therefore, the view matrix will be the inverse of the camera’s world transform.

The complete rendering journey will be:

```text
local
→ world
→ camera
→ screen
```

The screen transform will also handle the disagreement between mathematical coordinates and Canvas coordinates:

```text
world Y points upward
Canvas Y points downward
```

They will be forced to cooperate.

---

## Inverse Transformations

Inverse matrices will not exist merely to satisfy a textbook chapter.

They will power real engine features:

- world-to-local conversion;
- screen-to-world conversion;
- camera view matrices;
- mouse picking;
- transform debugging.

Example:

```text
local point
→ transformed into world space
→ transformed back into local space
```

The final point should approximately match the original point.

The engine will also verify:

```text
M × M⁻¹ ≈ Identity
```

If the determinant is zero, the matrix has destroyed information and cannot be inverted.

At that point, the engine will refuse politely—or throw an error.

---

## Determinant

The determinant will be treated as more than an unpleasant formula.

In 2D, it tells us:

- how much a transformation changes area;
- whether orientation was reflected;
- whether the transformation collapsed the plane;
- whether an inverse exists.

```text
|det(M)| > 1  → area increased
0 < |det(M)| < 1 → area decreased
det(M) < 0 → orientation flipped
det(M) = 0 → space collapsed and inverse died
```

A debug panel will display the current determinant while the transformed basis and unit square are drawn on screen.

---

## Debug Visualization

A math engine without visualization is just a collection of numbers waiting to become confusing.

Affine Mess will render debugging information for selected objects:

- local origin;
- world origin;
- local X and Y axes;
- transformed basis vectors;
- pivot;
- local and world bounds;
- local matrix;
- world matrix;
- determinant;
- inverse matrix;
- coordinate labels.

The goal is to make every transformation visible rather than mysterious.

---

## Planned Demonstrations

### Transform Playground

An interactive object with controls for:

- position;
- rotation;
- scale;
- pivot;
- shear;
- reflection;
- projection.

The current basis vectors and determinant will be displayed in real time.

### Order Matters

Two identical shapes receive the same transformations in different orders:

```text
Scale → Rotate
Rotate → Scale
```

The demo will provide visual evidence that matrix multiplication is not commutative.

### Pivot Panic

One object rotates around:

- its centre;
- a corner;
- an internal custom point;
- an external point.

### Inverse Dungeon

A point travels from local space to world space and back again.

Failure to return home means the inverse matrix has been defeated.

### Hierarchy Boss Fight

A multi-part character or mechanical arm demonstrates nested coordinate spaces and inherited transformations.

### Camera Chaos

The camera can:

- move;
- rotate;
- zoom;
- convert mouse coordinates from screen space into world space.

### Determinant Disaster

A unit square is transformed while its area and orientation are tracked.

At determinant zero, the square collapses into a line and loses the ability to return.

---

## Testing

Floating-point mathematics will be tested using approximate comparisons rather than strict equality.

Planned checks include:

- `(3, 4)` has length `5`;
- normalized vectors have length approximately `1`;
- perpendicular vectors have a dot product approximately equal to `0`;
- identity matrices leave values unchanged;
- a `90°` rotation sends `(1, 0)` to `(0, 1)`;
- translation affects points but not directions;
- rotation matrices have determinant approximately `1`;
- reflection matrices have determinant approximately `-1`;
- projection matrices have determinant approximately `0`;
- a matrix multiplied by its inverse produces identity;
- a rotation inverse matches its transpose;
- sequential transformations match a combined matrix;
- child world transforms correctly include parent transforms.

---

## Project Structure

```text
src/
├── math/
│   ├── Vec2.ts
│   ├── Mat2.ts
│   ├── Mat3.ts
│   └── MathUtils.ts
│
├── scene/
│   ├── Transform2D.ts
│   ├── Node2D.ts
│   ├── Mesh2D.ts
│   └── Scene.ts
│
├── rendering/
│   ├── Camera2D.ts
│   ├── CanvasRenderer.ts
│   └── DebugRenderer.ts
│
├── input/
│   └── Input.ts
│
├── demos/
│   ├── TransformPlayground.ts
│   ├── OrderMatters.ts
│   ├── PivotPanic.ts
│   ├── InverseDungeon.ts
│   ├── HierarchyBossFight.ts
│   └── CameraChaos.ts
│
└── tests/
    ├── Vec2.test.ts
    ├── Mat2.test.ts
    ├── Mat3.test.ts
    └── Transform2D.test.ts
```

The structure may evolve as the mess becomes more affine.

---

## Roadmap

### Phase 1 — Math Awakens

- [ ] Implement `Vec2`
- [ ] Implement `Mat2`
- [ ] Implement `Mat3`
- [ ] Add approximate floating-point comparisons
- [ ] Add unit tests

### Phase 2 — Shapes Enter the Arena

- [ ] Create basic meshes
- [ ] Transform vertices manually
- [ ] Render final points with Canvas
- [ ] Draw debug axes and origins

### Phase 3 — Affine Mess Begins

- [ ] Add translation, rotation, and scale
- [ ] Add shear, reflection, and projection
- [ ] Add transformation composition
- [ ] Add determinant and inverse
- [ ] Add configurable pivots

### Phase 4 — Parents Cause Problems

- [ ] Implement `Transform2D`
- [ ] Implement `Node2D`
- [ ] Add parent-child hierarchies
- [ ] Add local-to-world and world-to-local conversion

### Phase 5 — The Camera Watches

- [ ] Implement `Camera2D`
- [ ] Add view matrices
- [ ] Add zoom and rotation
- [ ] Add screen-to-world mouse conversion
- [ ] Add object picking in local space

### Phase 6 — Controlled Chaos

- [ ] Build all demonstration scenes
- [ ] Add an interactive debug interface
- [ ] Document the transformation pipeline
- [ ] Ensure every major mathematical feature has a visible example

---

## Non-Goals

Affine Mess is intentionally small.

This project will not initially include:

- 3D rendering;
- WebGL or OpenGL;
- perspective projection;
- lighting;
- textures;
- audio;
- rigid-body physics;
- collision resolution;
- ECS architecture;
- animation systems;
- asset pipelines;
- a level editor;
- seventeen abstraction layers around drawing a triangle.

Those belong to later projects.

This engine is about transformations, coordinate spaces, and understanding where every vertex goes.

---

## Definition of Done

Affine Mess will be considered complete when:

- objects can move, rotate, and scale;
- pivots can be repositioned;
- local mesh vertices remain immutable;
- child objects inherit parent transformations;
- the camera can move, rotate, and zoom;
- mouse coordinates can travel from screen to world to local space;
- matrix composition matches sequential transformation;
- inverse matrices correctly undo transformations;
- determinant behaviour is visible;
- changing matrix order produces visibly different results;
- no hidden Canvas transformation APIs perform the mathematics.

---

## Final Warning

Affine Mess is not designed to protect the developer from matrices.

It is designed to put the developer in a room with them until both sides understand each other.

When an object vanishes, stretches into infinity, reflects through the wrong axis, or rotates around a point in another country, the engine has not failed.

The lesson has begun.
