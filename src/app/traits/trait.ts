import { Entity, Side } from '../entities/entity';
import { Level } from '../levels/level';

export class Trait {

  name: string;

  constructor(name: string) {
    this.name = name;
  }

  obstruct(entity: Entity, side: Side) {}

  collides(us: Entity, them: Entity) {}

  update(entity: Entity, deltaTime: number, level: Level) {}
}