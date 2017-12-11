import { Entity, Side } from '../entities/entity';
import { Trait } from './trait';
import { Match } from '../tile-resolver';

export class Solid extends Trait {

  obstructs: boolean;

  constructor() {
    super('solid');
    this.obstructs = true;
  }

  obstruct(entity: Entity, side: Side, match: Match) {
    if (!this.obstructs) {
      return;
    }

    switch (side) {
      case Side.Bottom:
        entity.bounds.bottom = match.y1;
        entity.velocity.y = 0;
        break;
      case Side.Top:
        entity.bounds.top = match.y2;
        entity.velocity.y = 0;
        break;
      case Side.Left:
        entity.bounds.left = match.x2;
        entity.velocity.x = 0;
        break;
      case Side.Right:
        entity.bounds.right = match.x1;
        entity.velocity.x = 0;
        break;
    }
  }

}