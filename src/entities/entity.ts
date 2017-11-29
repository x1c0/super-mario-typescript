import { Vector } from '../vector';

interface EntityMethods {
  draw(context: CanvasRenderingContext2D): void;
  update(deltaTime: number): void;
}

export abstract class Entity implements EntityMethods {

  position: Vector;
  velocity: Vector;

  protected abstract _draw(context: CanvasRenderingContext2D): void;

  protected abstract _update(deltaTime: number): void;

  constructor() {
    this.position = new Vector(0, 0);
    this.velocity = new Vector(0, 0);
  }

  draw(context: CanvasRenderingContext2D): void {
    this._draw(context);
  }

  update(deltaTime: number): void {
    this._update(deltaTime);
  }
}


