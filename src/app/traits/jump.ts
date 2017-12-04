import { Entity, Sides } from '../entities/entity';
import { Trait } from './trait';

export class Jump extends Trait {

  duration: number;
  velocity: number;
  engageTime: number;
  ready: number;
  requestTime: number;
  gracePeriod: number; // period that entity is allowed to jump when falling
  speedBoost: number;

  constructor() {
    super('jump');
    this.duration = 0.3;
    this.velocity = 200;
    this.engageTime = 0;
    this.ready = 0;
    this.requestTime = 0;
    this.gracePeriod = 0.1;
    this.speedBoost = 0.3;
  }

  get falling() {
    return this.ready < 0;
  }

  start() {
    this.requestTime = this.gracePeriod;
  }

  cancel() {
    this.engageTime = 0;
    this.requestTime = 0;
  }

  obstruct(entity: Entity, side: Symbol) {
    if (side === Sides.BOTTOM) {
      this.ready = 1;
    } else if (side === Sides.TOP) {
      this.cancel();
    }
  }

  update(entity: Entity, deltaTime: number) {
    if (this.requestTime > 0) {
      if (this.ready > 0) {
        this.engageTime = this.duration;
        this.requestTime = 0;
      }
      this.requestTime -= deltaTime;
    }

    if (this.engageTime > 0) {
      entity.velocity.y = -(this.velocity + Math.abs(entity.velocity.x) * this.speedBoost);
      this.engageTime -= deltaTime;
    }

    this.ready--;
  }

}