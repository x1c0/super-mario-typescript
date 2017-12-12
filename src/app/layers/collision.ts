import { Level } from '../levels/level';
import { Camera } from '../camera';
import { Entity } from '../entities/entity';
import { TileCollider } from '../tile-collider';

function createEntityLayer(entities: Set<Entity>) {
  return function drawBoundingBox(context: CanvasRenderingContext2D, camera: Camera) {
    context.strokeStyle = 'red';
    entities.forEach((entity: Entity) => {
      context.beginPath();
      context.rect(
        entity.bounds.left - camera.position.x,
        entity.bounds.top - camera.position.y,
        entity.size.x, entity.size.y);
      context.stroke();
    });
  }
}

function createTileCandidateLayer(tileCollider: TileCollider) {
  const resolvedTiles: any[] = [];
  const tileResolver = tileCollider.tiles;
  const tileSize = tileResolver.tileSize;
  const getByIndexOriginal = tileResolver.getByIndex;

  tileResolver.getByIndex = function getByIndexFake(x, y) {
    resolvedTiles.push({ x, y });
    return getByIndexOriginal.call(tileResolver, x, y);
  };

  return function drawTileCandidates(context: CanvasRenderingContext2D, camera: Camera) {
    context.strokeStyle = 'blue';
    resolvedTiles.forEach(({ x, y }) => {
      context.beginPath();
      context.rect(
        x * tileSize - camera.position.x,
        y * tileSize - camera.position.y,
        tileSize, tileSize);
      context.stroke();
    });
    resolvedTiles.length = 0;
  }
}

export function createCollisionLayer(level: Level): (context: CanvasRenderingContext2D, camera: Camera) => void {
  const drawBoundingBoxes = createEntityLayer(level.entities);
  const drawTileCandidates = createTileCandidateLayer(level.tileCollider);

  return function drawLayer(context: CanvasRenderingContext2D, camera: Camera) {
    drawTileCandidates(context, camera);
    drawBoundingBoxes(context, camera);
  }
}
