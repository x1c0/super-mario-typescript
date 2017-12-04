import { SpriteSheet } from '../sprite-sheet';
import { Entity } from '../entities/entity';
import { Level } from '../levels/level';
import { Camera } from '../camera';
import { CanvasHelper } from '../canvas-helper';

export function createBackgroundLayer(level: Level, backgroundSprites: SpriteSheet): (context: CanvasRenderingContext2D, camera: Camera) => void {
  const canvasHelper = new CanvasHelper(256 + 16, 240);
  const resolver = level.tileCollider.tiles;
  let startIndex: number;
  let endIndex: number;

  function redraw(drawFrom: number, drawTo: number) {
    startIndex = drawFrom;
    endIndex = drawTo;

    for (let x = startIndex; x <= endIndex; x++) {
      const col = level.tiles.grid[x];
      if (col) {
        col.forEach((tile: any, y: number) => {
          if (backgroundSprites.animations.has(tile.name)) {
            backgroundSprites.drawAnimation(tile.name, canvasHelper.context, x - startIndex, y, level.totalTime);
          } else {
            backgroundSprites.drawTile(tile.name, canvasHelper.context, x - startIndex, y);
          }
        });
      }
    }
  }

  return function drawLayer(context: CanvasRenderingContext2D, camera: Camera) {
    const drawWith = resolver.toIndex(camera.size.x);
    const drawFrom = resolver.toIndex(camera.position.x);
    const drawTo = drawFrom + drawWith;

    redraw(drawFrom, drawTo);

    context.drawImage(
      canvasHelper.buffer,
      -camera.position.x % 16,
      -camera.position.y);
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

export function createCameraLayer(cameraToDraw: Camera): (context: CanvasRenderingContext2D, camera: Camera) => void {
  return function drawLayer(context: CanvasRenderingContext2D, fromCamera: Camera) {
    context.strokeStyle = 'purple';
    context.rect(
      cameraToDraw.position.x - fromCamera.position.x,
      cameraToDraw.position.y - fromCamera.position.y,
      cameraToDraw.size.x,
      cameraToDraw.size.y);
    context.stroke();
  }
}
