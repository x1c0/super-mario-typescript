import { Trait } from './trait';
import { Entity } from '../entities/entity';

export class Stomper extends Trait {

  bounceSpeed: number;
  onStomp : (us: Entity, them: Entity) => void;

  constructor() {
    super('stomper');
    this.bounceSpeed = 400;

    this.onStomp = (us: Entity, them: Entity) => {};
  }

  bounce(us: Entity, them: Entity) {
    us.bounds.bottom = them.bounds.top;
    us.velocity.y = -this.bounceSpeed;
  }

  collides(us: Entity, them: Entity) {
    if (!them.killable || them.killable.dead) {
      return;
    }
    if (us.velocity.y > them.velocity.y) {
      this.bounce(us, them);
      this.onStomp(us, them);
    }
  }

}
