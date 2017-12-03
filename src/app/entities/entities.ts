import { loadMarioSprite } from '../loaders';
import { SpriteSheet } from '../sprite-sheet';
import { Entity } from './entity';
import { Jump } from '../traits/jump';
import { Go } from '../traits/go';

export function createMario(): Promise<Entity> {
  return loadMarioSprite().then((sprite: SpriteSheet) => {
    const mario = new Entity();
    mario.size.set(14, 16);
    mario.addTrait(new Go());
    mario.addTrait(new Jump());

    mario.draw = function drawMario(context: CanvasRenderingContext2D) {
      sprite.draw('idle', context, 0, 0);
    };

    return mario;
  });
}