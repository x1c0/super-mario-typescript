import { Vector } from '../math/vector';
import { Trait } from '../traits/trait';

export class Entity {

  position: Vector;
  velocity: Vector;
  size: Vector;
  traits: Trait[];
  [key: string]: any;

  constructor() {
    this.position = new Vector(0, 0);
    this.velocity = new Vector(0, 0);
    this.size = new Vector(0, 0);
    this.traits = [];
  }

  addTrait(trait: Trait) {
    this.traits.push(trait);
    this[trait.name] = trait;
  }

  update(deltaTime: number): void {
    this.traits.forEach((trait: Trait) => {
      trait.update(this, deltaTime);
    });
  }

}
