import { Trait } from './trait';
import { Entity } from '../entities/entity';
import { Level } from '../levels/level';

export enum KoopaState {
  Walking,
  Hiding,
  Panic
}

export class KoopaBehavior extends Trait {

  state: KoopaState;
  hideTime: number;
  hideDuration: number;
  panicSpeed: number;
  walkSpeed: number;


  constructor() {
    super('behavior');
    this.state = KoopaState.Walking;
    this.hideTime = 0;
    this.hideDuration = 5;
    this.panicSpeed = 300;
    this.walkSpeed = null;
  }

  collides(us: Entity, them: Entity) {
    if (us.killable.dead) {
      return;
    }
    if (them.stomper) {
      if (them.velocity.y > us.velocity.y) {
        this.handleStomp(us);
      } else {
        this.handleNudge(us, them);
      }
    }
  }

  handleNudge(us: Entity, them: Entity) {
    switch (this.state) {
      case KoopaState.Walking:
        them.killable.kill();
        break;
      case KoopaState.Hiding:
        this.panic(us, them);
        break;
      case KoopaState.Panic:
        const travelDirection = Math.sign(us.velocity.x);
        const impactDirection = Math.sign(us.position.x - them.position.x);
        if (travelDirection !== 0 && travelDirection !== impactDirection) {
          them.killable.kill();
        }
        break;
    }
  }

  handleStomp(us: Entity) {
    if (this.state === KoopaState.Walking) {
      this.hide(us);
    } else if (this.state === KoopaState.Hiding) {
      us.killable.kill();
      us.velocity.set(100, -200);
      us.solid.obstructs = false;
    } else if (this.state === KoopaState.Panic) {
      this.hide(us);
    }
  }

  panic(us: Entity, them: Entity) {
    us.pendulumMove.enabled = true;
    us.pendulumMove.speed = this.panicSpeed * Math.sign(them.velocity.x);
    this.state = KoopaState.Panic;
  }

  hide(us: Entity) {
    us.velocity.x = 0;
    us.pendulumMove.enabled = false;
    if (this.walkSpeed === null) {
      this.walkSpeed = us.pendulumMove.speed;
    }
    this.hideTime = 0;
    this.state = KoopaState.Hiding;
  }

  unHide(us: Entity) {
    us.pendulumMove.enabled = true;
    us.pendulumMove.speed = this.walkSpeed;
    this.state = KoopaState.Walking;
  }

  update(us: Entity, deltaTime: number, level: Level) {
    if (this.state === KoopaState.Hiding) {
      this.hideTime += deltaTime;
      if (this.hideTime > this.hideDuration) {
        this.unHide(us);
      }
    }

  }

}