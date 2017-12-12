import { Trait } from './trait';
import { Entity } from '../entities/entity';
import { Level } from '../levels/level';
import { Vector } from '../math/vector';

export class PlayerController extends Trait {

  player: Entity;
  ckeckpoint: Vector;
  time: number;
  score: number;

  constructor() {
    super('playerController');
    this.player = null;
    this.ckeckpoint = new Vector(0, 0);
    this.time = 300;
    this.score = 0;
  }

  setPlayer(entity: Entity) {
    this.player = entity;
    this.player.stomper.onStomp = () => {
      this.score += 100;
    }
  }

  update(entity: Entity, deltaTime: number, level: Level) {
    if (!level.entities.has(this.player)) {
      this.player.killable.revive();
      this.player.position.set(this.ckeckpoint.x, this.ckeckpoint.y);
      level.entities.add(this.player);
    } else {
      this.time -= deltaTime * 2;
    }
  }

}
