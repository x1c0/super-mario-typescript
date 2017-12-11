import { Entity, Side } from '../entities/entity';
import { Trait } from './trait';

export class PendulumMove extends Trait {

  speed: number;
  enabled: boolean;

  constructor() {
    super('pendulumMove');
    this.speed = -30;
    this.enabled = true;
  }

  obstruct(entity: Entity, side: Side) {
    if (side === Side.Left || side === Side.Right) {
      this.speed = -this.speed;
    }
  }

  update(entity: Entity) {
    if (this.enabled) {
      entity.velocity.x = this.speed;
    }
  }

}
