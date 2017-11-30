import { Entity } from '../entities/entity';
import { Trait } from './trait';

export class Go extends Trait {

  direction: number;
  speed: number;

  constructor() {
    super('go');
    this.direction = 0;
    this.speed = 6000;
  }

  update(entity: Entity, deltaTime: number) {
    entity.velocity.x = this.speed * this.direction * deltaTime;
  }

}
