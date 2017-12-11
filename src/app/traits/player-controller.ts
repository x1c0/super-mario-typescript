import { Trait } from './trait';
import { Entity } from '../entities/entity';
import { Level } from '../levels/level';
import { Vector } from '../math/vector';

export class PlayerController extends Trait {

  player: Entity;
  ckeckpoint: Vector;

  constructor() {
    super('playerController');
    this.player = null;
    this.ckeckpoint = new Vector(0, 0);
  }

  setPlayer(entity: Entity) {
    this.player = entity;
  }

  update(entity: Entity, deltaTime: number, level: Level) {
    if (!level.entities.has(this.player)) {
      this.player.killable.revive();
      this.player.position.set(this.ckeckpoint.x, this.ckeckpoint.y);
      level.entities.add(this.player);
    }
  }

}
