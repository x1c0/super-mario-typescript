import { Vector } from '../math/vector';
import { Trait } from '../traits/trait';
import { BoundingBox } from '../bounding-box';
import { Level } from '../levels/level';


/*export const Sides = {
  TOP: Symbol('top'),
  BOTTOM: Symbol('bottom'),
  RIGHT: Symbol('right'),
  LEFT: Symbol('left')
};*/

export enum Side {
  Top,
  Right,
  Bottom,
  Left
}

export class Entity {

  position: Vector;
  velocity: Vector;
  offset: Vector;
  size: Vector;
  traits: Trait[];
  [key: string]: any;
  lifeTime: number;
  bounds: BoundingBox;
  canCollide: boolean;

  constructor() {
    this.position = new Vector(0, 0);
    this.velocity = new Vector(0, 0);
    this.offset = new Vector(0, 0);
    this.size = new Vector(0, 0);
    this.traits = [];
    this.lifeTime = 0;
    this.bounds = new BoundingBox(this.position, this.size, this.offset);
    this.canCollide = true;
  }

  addTrait(trait: Trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
  }

  collides(candidate: Entity) {
    this.traits.forEach((trait: Trait) => {
      trait.collides(this, candidate);
    });
  }

  draw(context: CanvasRenderingContext2D) {

  }

  obstruct(side: Side) {
    this.traits.forEach((trait: Trait) => {
      trait.obstruct(this, side);
    });
  }

  update(deltaTime: number, level: Level): void {
    this.traits.forEach((trait: Trait) => {
      trait.update(this, deltaTime, level);
    });
    this.lifeTime += deltaTime;
  }

}
