import { Entity, Side } from '../entities/entity';
import { Level } from '../levels/level';

interface Task {
  (): void
}

export class Trait {

  name: string;
  tasks: Task[];

  constructor(name: string) {
    this.name = name;
    this.tasks = [];
  }

  finalize() {
    this.tasks.forEach((task: Task) => task());
    this.tasks.length = 0;
  }

  queue(task: Task) {
    this.tasks.push(task);
  }

  obstruct(entity: Entity, side: Side) {}

  collides(us: Entity, them: Entity) {}

  update(entity: Entity, deltaTime: number, level: Level) {}
}