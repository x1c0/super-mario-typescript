import { Entity } from './entity';

export class Mario extends Entity {

  constructor() {
    super();
  }

  _draw(context: CanvasRenderingContext2D): void {}

  _update(deltaTime: number) {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
  };
}