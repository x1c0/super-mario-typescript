import { SpriteSheet } from '../sprites/sprite-sheet';
import { Entity } from '../entities/entity';
import { Level } from '../levels/level';
import { Camera } from '../camera';
import { CanvasHelper } from '../canvas-helper';

export function createBackgroundLayer(level: Level, backgroundSprites: SpriteSheet): (context: CanvasRenderingContext2D, camera: Camera) => void {
  const canvasHelper = new CanvasHelper(2048, 240);

  level.tiles.forEachTile((tile: any, x: number, y: number) => {
    backgroundSprites.drawTile(tile.name, canvasHelper.context, x, y);
  });

  return function drawLayer(context: CanvasRenderingContext2D, camera: Camera) {
    context.drawImage(canvasHelper.buffer, -camera.position.x, -camera.position.y);
  }
}

export function createSpriteLayer(entities: Set<Entity>, width: number = 64, height: number = 64): (context: CanvasRenderingContext2D, camera: Camera) => void {
  const spriteCanvas = new CanvasHelper(width, height);
  return function drawLayer(mainContext: CanvasRenderingContext2D, camera: Camera) {
    entities.forEach((entity: Entity) => {
      // clear the spriteCanvas context
      spriteCanvas.context.clearRect(0, 0, width, height);

      entity.draw(spriteCanvas.context);

      mainContext.drawImage(
        spriteCanvas.buffer,
        entity.position.x - camera.position.x,
        entity.position.y - camera.position.y);
    });
  }
}

export function createCollisionLayer(level: Level): (context: CanvasRenderingContext2D, camera: Camera) => void {
  const resolvedTiles: any[] = [];

  const tileResolver = level.tileCollider.tiles;
  const tileSize = tileResolver.tileSize;

  const getByIndexOriginal = tileResolver.getByIndex;

  tileResolver.getByIndex = function getByIndexFake(x, y) {
    resolvedTiles.push({ x, y });
    return getByIndexOriginal.call(tileResolver, x, y);
  };

  return function drawLayer(context: CanvasRenderingContext2D, camera: Camera) {
    context.strokeStyle = 'blue';
    resolvedTiles.forEach(({ x, y }) => {
      context.beginPath();
      context.rect(
        x * tileSize - camera.position.x,
        y * tileSize - camera.position.y,
        tileSize, tileSize);
      context.stroke();
    });

    context.strokeStyle = 'red';
    level.entities.forEach((entity: Entity) => {
      context.beginPath();
      context.rect(
        entity.position.x - camera.position.x,
        entity.position.y - camera.position.y,
        entity.size.x, entity.size.y);
      context.stroke();
    });

    resolvedTiles.length = 0;
  }

}
