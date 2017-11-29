import { SpriteSheet } from './sprite-sheet';
import { Entity } from './entities/entity';
import { Background } from './loaders';

export function createBackgroundLayer(backgrounds: Background[], backgroundSprites: SpriteSheet) {
  const buffer = document.createElement('canvas');
  buffer.width = 256;
  buffer.height = 240;

  backgrounds.forEach((background: Background) => {
    return drawBackground(background, buffer.getContext('2d'), backgroundSprites);
  });

  return function drawBackgroundLayer(context: CanvasRenderingContext2D) {
    context.drawImage(buffer, 0, 0);
  }
}

function drawBackground(background: Background, context: CanvasRenderingContext2D, sprites: SpriteSheet) {
  background.ranges.forEach(([x1, x2, y1, y2]) => {
    for (let x = x1; x < x2; x++) {
      for (let y = y1; y < y2; y++) {
        sprites.drawTile(background.tile, context, x, y);
      }
    }
  })
}

export function createSpriteLayer(entity: Entity) {
  return function drawSpriteLayer(context: CanvasRenderingContext2D) {
    entity.draw(context);
  }
}
