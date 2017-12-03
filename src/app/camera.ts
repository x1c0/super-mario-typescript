import { Vector } from './math/vector';

export class Camera {

  position: Vector;
  size: Vector;

  constructor() {
    this.position = new Vector(0, 0);
    this.size = new Vector(256, 224);
  }

}