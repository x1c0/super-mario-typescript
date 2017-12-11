import { LayerCompositor } from '../layers/layer-compositor';
import { Entity } from '../entities/entity';
import { Matrix } from '../math/matrix';
import { TileCollider } from '../tile-collider';
import { EntityCollider } from '../entity-collider';

export class Level {

  compositor: LayerCompositor;
  entities: Set<Entity>;
  tileCollider: TileCollider;
  gravity: number;
  totalTime: number;
  entityColider: EntityCollider;

  constructor() {
    this.compositor = new LayerCompositor();
    this.entities = new Set();
    this.tileCollider = null;
    this.gravity = 1500;
    this.totalTime = 0;
    this.entityColider = new EntityCollider(this.entities);
  }

  setCollisionGrid(matrix: Matrix) {
    this.tileCollider = new TileCollider(matrix);
  }

  update(deltaTime: number) {
    this.entities.forEach((entity: Entity) => {
      entity.update(deltaTime, this);

      entity.position.x += entity.velocity.x * deltaTime;
      this.tileCollider.checkX(entity);

      entity.position.y += entity.velocity.y * deltaTime;
      this.tileCollider.checkY(entity);

      entity.velocity.y += this.gravity * deltaTime;
    });

    this.entities.forEach((entity: Entity) => {
      this.entityColider.check(entity);
    });

    this.entities.forEach((entity: Entity) => {
      entity.finalize();
    });

    this.totalTime += deltaTime;
  }

}