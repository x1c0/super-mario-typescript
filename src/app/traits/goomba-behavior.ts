import { Trait } from './trait';
import { Entity } from '../entities/entity';

export class GoombaBehavior extends Trait {

  constructor() {
    super('behavior');
  }

  collides(us: Entity, them: Entity) {
    if (us.killable.dead) {
      return;
    }
    if (them.stomper) {
      if (them.velocity.y > us.velocity.y) {
        us.killable.kill();
        us.pendulumMove.speed = 0;
      } else {
        them.killable.kill();
      }
    }
  }
}
