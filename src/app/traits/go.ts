import { Entity } from '../entities/entity';
import { Trait } from './trait';

export class Go extends Trait {

  direction: number;
  speed: number;
  distance: number;
  heading: number;

  constructor() {
    super('go');
    this.direction = 0;
    this.speed = 6000;
    this.distance = 0;
    this.heading = 1;
  }

  update(entity: Entity, deltaTime: number) {
    entity.velocity.x = this.speed * this.direction * deltaTime;
    if (this.direction) {
      this.heading = this.direction;
      this.distance += Math.abs(entity.velocity.x * deltaTime);
    } else {
      this.distance = 0;
    }

  }

}
