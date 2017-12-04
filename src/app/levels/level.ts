import { LayerCompositor } from '../layers/layer-compositor';
import { Entity } from '../entities/entity';
import { Matrix } from '../math/matrix';
import { TileCollider } from '../tile-collider';

export class Level {

  compositor: LayerCompositor;
  entities: Set<Entity>;
  tiles: Matrix;
  tileCollider: TileCollider;
  gravity: number;
  totalTime: number;

  constructor() {
    this.compositor = new LayerCompositor();
    this.entities = new Set();
    this.tiles = new Matrix();
    this.tileCollider = new TileCollider(this.tiles);
    this.gravity = 2000;
    this.totalTime = 0;
  }

  update(deltaTime: number) {
    this.entities.forEach((entity: Entity) => {
      entity.update(deltaTime);

      entity.position.x += entity.velocity.x * deltaTime;
      this.tileCollider.checkX(entity);

      entity.position.y += entity.velocity.y * deltaTime;
      this.tileCollider.checkY(entity);

      entity.velocity.y += this.gravity * deltaTime;
    });
    this.totalTime += deltaTime;
  }

}