import { Vector } from '../math/vector';
import { Trait } from '../traits/trait';
import { BoundingBox } from '../bounding-box';


export const Sides = {
  TOP: Symbol('top'),
  BOTTOM: Symbol('bottom'),
  RIGHT: Symbol('right'),
  LEFT: Symbol('left')
};

export class Entity {

  position: Vector;
  velocity: Vector;
  offset: Vector;
  size: Vector;
  traits: Trait[];
  [key: string]: any;
  lifeTime: number;
  bounds: BoundingBox;

  constructor() {
    this.position = new Vector(0, 0);
    this.velocity = new Vector(0, 0);
    this.offset = new Vector(0, 0);
    this.size = new Vector(0, 0);
    this.traits = [];
    this.lifeTime = 0;
    this.bounds = new BoundingBox(this.position, this.size, this.offset);
  }

  addTrait(trait: Trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
  }

  obstruct(side: Symbol) {
    this.traits.forEach((trait: Trait) => {
      trait.obstruct(this, side);
    });
  }

  update(deltaTime: number): void {
    this.traits.forEach((trait: Trait) => {
      trait.update(this, deltaTime);
    });
    this.lifeTime += deltaTime;
  }

}
