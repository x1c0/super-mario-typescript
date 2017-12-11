import { loadSpriteSheet } from '../loaders';
import { SpriteSheet } from '../sprite-sheet';
import { Entity } from './entity';
import { PendulumMove } from '../traits/pendulum-walk';
import { Killable } from '../traits/killable';
import { KoopaBehavior, KoopaState } from '../traits/koopa-behavior';

export function loadKoopa(): Promise<() => Entity> {
  return loadSpriteSheet('koopa')
    .then(createKoopaFactory);
}

function createKoopaFactory(sprite: SpriteSheet) {

  const walkAnimation = sprite.animations.get('walk');
  const wakeAnimation = sprite.animations.get('wake');

  function routeAnimation(koopa: Entity) {
    if (koopa.behavior.state === KoopaState.Hiding) {
      if (koopa.behavior.hideTime > 3) {
        return wakeAnimation(koopa.behavior.hideTime);
      }
      return 'hiding';
    }
    if (koopa.behavior.state === KoopaState.Panic) {
      return 'hiding';
    }
    return walkAnimation(koopa.lifeTime);
  }

  function drawKoopa(context: CanvasRenderingContext2D) {
    sprite.draw(routeAnimation(this), context, 0, 0, this.velocity.x < 0);
  }

  return function createKoopa() {
    const koopa = new Entity();
    koopa.size.set(16, 16);
    koopa.offset.y = 8;

    koopa.addTrait(new PendulumMove());
    koopa.addTrait(new Killable());
    koopa.addTrait(new KoopaBehavior());

    koopa.draw = drawKoopa;

    return koopa;
  }
}
