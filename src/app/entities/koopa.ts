import { loadSpriteSheet } from '../loaders';
import { SpriteSheet } from '../sprite-sheet';
import { Entity } from './entity';
import { PendulumWalk } from '../traits/pendulum-walk';

export function loadKoopa(): Promise<() => Entity> {
  return loadSpriteSheet('koopa')
    .then(createKoopaFactory);
}

function createKoopaFactory(sprite: SpriteSheet) {

  const walkAnimation = sprite.animations.get('walk');

  function drawKoopa(context: CanvasRenderingContext2D) {
    sprite.draw(walkAnimation(this.lifeTime), context, 0, 0, this.velocity.x < 0);
  }

  return function createKoopa() {
    const koopa = new Entity();
    koopa.size.set(16, 16);
    koopa.offset.y = 8;

    koopa.addTrait(new PendulumWalk());

    koopa.draw = drawKoopa;

    return koopa;
  }
}
