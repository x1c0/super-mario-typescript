import { Entity } from '../entities/entity';
import { Trait } from './trait';

export class Jump extends Trait {

  duration: number;
  velocity: number;
  engageTime: number;


  constructor() {
    super('jump');
    this.duration = 0.5;
    this.velocity = 200;
    this.engageTime = 0;
  }

  start() {
    this.engageTime = this.duration;
  }

  cancel() {
    this.engageTime = 0;
  }

  update(entity: Entity, deltaTime: number) {
    if (this.engageTime > 0) {
      entity.velocity.y = -this.velocity;
      this.engageTime -= deltaTime;
    }
  }

}