import { Vector } from './math/vector';

export class BoundingBox {

  position: Vector;
  size: Vector;
  offset: Vector;

  constructor(position: Vector, size: Vector, offset: Vector) {
    this.position = position;
    this.size = size;
    this.offset = offset;
  }

  get bottom() {
    return this.position.y + this.size.y + this.offset.y;
  }

  set bottom(y: number) {
    this.position.y = y - (this.size.y + this.offset.y);
  }

  get top() {
    return this.position.y + this.offset.y;
  }

  set top(y: number) {
    this.position.y = y - this.offset.y;
  }

  get left() {
    return this.position.x + this.offset.x;
  }

  set left(x: number) {
    this.position.x = x - this.offset.x;
  }

  get right() {
    return this.position.x + this.size.x + this.offset.x;
  }

  set right(x: number) {
    this.position.x = x - (this.size.x + this.offset.x);
  }
}