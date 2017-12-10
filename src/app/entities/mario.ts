import { loadSpriteSheet } from '../loaders';
import { SpriteSheet } from '../sprite-sheet';
import { Entity } from './entity';
import { Jump } from '../traits/jump';
import { Go } from '../traits/go';

const FAST_DRAG = 1 / 5000;
const SLOW_DRAG = 1 / 1000;

export function loadMario(): Promise<() => Entity> {
  return loadSpriteSheet('mario')
    .then(createMarioFactory);
}

function createMarioFactory(sprite: SpriteSheet) {

  const runAnimation = sprite.animations.get('run');

  function routeFrame(mario: Entity): string {
    if (mario.jump.falling) {
      return 'jump';
    }
    if (mario.go.distance > 0) {
      if ((mario.velocity.x > 0 && mario.go.direction < 0) ||
        (mario.velocity.x < 0 && mario.go.direction > 0)) {
        return 'break';
      }
      return runAnimation(mario.go.distance);
    }
    return 'idle';
  }

  function setTurboState(turboOn: boolean) {
    this.go.dragFactor = turboOn ? FAST_DRAG : SLOW_DRAG;
  }

  function drawMario(context: CanvasRenderingContext2D) {
    sprite.draw(routeFrame(this), context, 0, 0, this.go.heading < 0);
  }

  return function createMario() {
    const mario = new Entity();
    mario.size.set(14, 16);

    mario.addTrait(new Go());
    mario.addTrait(new Jump());

    mario.turbo = setTurboState;
    mario.draw = drawMario;

    mario.turbo(false);

    return mario;
  }
}
