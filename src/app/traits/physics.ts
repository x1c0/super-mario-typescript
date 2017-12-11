import { Trait } from './trait';
import { Level } from '../levels/level';
import { Entity } from '../entities/entity';

export class Physics extends Trait {

  constructor() {
    super('physics');
  }

  update(entity: Entity, deltaTime: number, level: Level) {
    entity.position.x += entity.velocity.x * deltaTime;
    level.tileCollider.checkX(entity);

    entity.position.y += entity.velocity.y * deltaTime;
    level.tileCollider.checkY(entity);

    entity.velocity.y += level.gravity * deltaTime;
  }

}