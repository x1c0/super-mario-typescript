import { SpriteSheet } from '../sprites/sprite-sheet';
import { Entity } from '../entities/entity';
import { Level } from '../levels/level';

export function createBackgroundLayer(level: Level, backgroundSprites: SpriteSheet) {
  const buffer = document.createElement('canvas');
  const context = buffer.getContext('2d');
  buffer.width = 256;
  buffer.height = 240;

  level.tiles.forEachTile((tile: any, x: number, y: number) => {
    backgroundSprites.drawTile(tile.name, context, x, y);
  });

  return function drawBackgroundLayer(context: CanvasRenderingContext2D) {
    context.drawImage(buffer, 0, 0);
  }
}

export function createSpriteLayer(entities: Set<Entity>) {
  return function drawSpriteLayer(context: CanvasRenderingContext2D) {
    entities.forEach((entity: Entity) => {
      entity.draw(context);
    });
  }
}

export function createCollisionLayer(level: Level) {
  const resolvedTiles: any[] = [];

  const tileResolver = level.tileCollider.tiles;
  const tileSize = tileResolver.tileSize;

  const getByIndexOriginal = tileResolver.getByIndex;

  tileResolver.getByIndex = function getByIndexFake(x, y) {
    resolvedTiles.push({ x, y });
    return getByIndexOriginal.call(tileResolver, x, y);
  };

  return function drawCollision(context: CanvasRenderingContext2D) {
    context.strokeStyle = 'blue';
    resolvedTiles.forEach(({ x, y }) => {
      context.beginPath();
      context.rect(x * tileSize, y * tileSize, tileSize, tileSize);
      context.stroke();
    });

    context.strokeStyle = 'red';
    level.entities.forEach((entity:Entity)=>{
      context.beginPath();
      context.rect(entity.position.x, entity.position.y, entity.size.x, entity.size.y);
      context.stroke();
    });

    resolvedTiles.length = 0;
  }

}
