import { Entity } from '../entities/entity';

export class Trait {

  name: string;

  constructor(name: string) {
    this.name = name;
  }

  obstruct(entity: Entity, side: Symbol) {}

  update(entity: Entity, deltaTime: number) {
    console.warn('Unhandled update call in Trait');
  }
}