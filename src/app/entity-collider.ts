import { Entity } from './entities/entity';

export class EntityCollider {

  entities: Set<Entity>;

  constructor(entities: Set<Entity>) {
    this.entities = entities;
  }

  check(subject: Entity) {
    this.entities.forEach((candidate: Entity) => {
      if (subject === candidate) {
        return;
      }
      if (subject.bounds.overlaps(candidate.bounds)) {
        subject.collides(candidate);
        candidate.collides(subject);
      }
    });
  }

}
