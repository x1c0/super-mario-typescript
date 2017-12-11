import { loadSpriteSheet } from '../loaders';
import { SpriteSheet } from '../sprite-sheet';
import { Entity } from './entity';
import { PendulumMove } from '../traits/pendulum-walk';
import { GoombaBehavior } from '../traits/goomba-behavior';
import { Killable } from '../traits/killable';
import { Solid } from '../traits/solid';

export function loadGoomba(): Promise<() => Entity> {
  return loadSpriteSheet('goomba')
    .then(createGoombaFactory);
}

function createGoombaFactory(sprite: SpriteSheet) {

  const walkAnimation = sprite.animations.get('walk');

  function routeAnimation(goomba: Entity) {
    if (goomba.killable.dead) {
      return 'flat';
    }

    return walkAnimation(goomba.lifeTime);
  }


  function drawGoomba(context: CanvasRenderingContext2D) {
    sprite.draw(routeAnimation(this), context, 0, 0);
  }

  return function createGoomba() {
    const goomba = new Entity();
    goomba.size.set(16, 16);

    goomba.addTrait(new Solid());
    goomba.addTrait(new PendulumMove());
    goomba.addTrait(new GoombaBehavior());
    goomba.addTrait(new Killable());

    goomba.draw = drawGoomba;

    return goomba;
  }
}
