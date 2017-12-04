import { Entity } from './entities/entity';
import { KeyboardState, PRESSED } from './keyboard-state';

export function setupKeyboard(mario: Entity) {
  const input = new KeyboardState();

  input.addMapping('KeyP', (keyState) => {
    if (keyState === PRESSED) {
      mario.jump.start();
    } else {
      mario.jump.cancel();
    }
  });

  input.addMapping('KeyO', (keyState) => {
    mario.turbo(keyState);
  });

  input.addMapping('KeyD', (keyState) => {
    mario.go.direction += keyState ? 1 : -1;
  });

  input.addMapping('KeyA', (keyState) => {
    mario.go.direction += keyState ? -1 : 1;
  });

  return input;
}
