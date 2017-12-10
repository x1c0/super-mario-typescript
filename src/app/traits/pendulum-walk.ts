import { Entity, Sides } from '../entities/entity';
import { Trait } from './trait';

export class PendulumWalk extends Trait {

  speed: number;

  constructor() {
    super('pendulumWalk');
    this.speed = -30;
  }

  obstruct(entity: Entity, side: Symbol) {
    if (side === Sides.LEFT || side === Sides.RIGHT) {
      this.speed = -this.speed;
    }
  }

  update(entity: Entity) {
    entity.velocity.x = this.speed;
  }

}
