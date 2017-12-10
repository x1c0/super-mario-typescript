import { loadSpriteSheet } from '../loaders';
import { SpriteSheet } from '../sprite-sheet';
import { Entity } from './entity';
import { PendulumWalk } from '../traits/pendulum-walk';

export function loadGoomba(): Promise<() => Entity> {
  return loadSpriteSheet('goomba')
    .then(createGoombaFactory);
}

function createGoombaFactory(sprite: SpriteSheet) {

  const walkAnimation = sprite.animations.get('walk');

  function drawGoomba(context: CanvasRenderingContext2D) {
    sprite.draw(walkAnimation(this.lifeTime), context, 0, 0);
  }

  return function createGoomba() {
    const goomba = new Entity();
    goomba.size.set(16, 16);

    goomba.addTrait(new PendulumWalk());

    goomba.draw = drawGoomba;

    return goomba;
  }
}
