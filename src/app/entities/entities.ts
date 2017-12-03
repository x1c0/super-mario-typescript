import { loadSpriteSheet } from '../loaders';
import { SpriteSheet } from '../sprite-sheet';
import { Entity } from './entity';
import { Jump } from '../traits/jump';
import { Go } from '../traits/go';
import { createAnimation } from '../animation';

export function createMario(): Promise<Entity> {
  return loadSpriteSheet('mario')
    .then((sprite: SpriteSheet) => {
      const mario = new Entity();
      mario.size.set(14, 16);
      mario.addTrait(new Go());
      mario.addTrait(new Jump());

      const runAnimation = createAnimation(['run-1', 'run-2', 'run-3'], 10);

      function routeFrame(mario: Entity) {
        if (mario.go.direction !== 0) {
          return runAnimation(mario.go.distance);
        }
        return 'idle';
      }

      mario.draw = function drawMario(context: CanvasRenderingContext2D) {
        sprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0);
      };

      return mario;
    });
}