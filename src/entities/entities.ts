import { loadMarioSprite } from '../sprites';
import { SpriteSheet } from '../sprite-sheet';
import { Mario } from './mario';

export function createMario(): Promise<Mario> {
  return loadMarioSprite().then((sprite: SpriteSheet) => {
    const mario = new Mario();

    mario.draw = function drawMario(context: CanvasRenderingContext2D) {
      sprite.draw('idle', context, this.position.x, this.position.y);
    };

    return mario;
  });
}