import { SpriteSheet } from '../sprite-sheet';
import { TileResolver } from '../tile-resolver';
import { Matrix } from '../math/matrix';
import { Level } from '../levels/level';
import { Camera } from '../camera';
import { CanvasHelper } from '../canvas-helper';

export function createBackgroundLayer(level: Level, tiles: Matrix, backgroundSprites: SpriteSheet): (context: CanvasRenderingContext2D, camera: Camera) => void {
  const resolver = new TileResolver(tiles);
  const canvasHelper = new CanvasHelper(256 + 16, 240);

  function redraw(startIndex: number, endIndex: number) {
    canvasHelper.context.clearRect(0, 0, canvasHelper.buffer.width, canvasHelper.buffer.height);

    for (let x = startIndex; x <= endIndex; x++) {
      const col = tiles.grid[x];
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
