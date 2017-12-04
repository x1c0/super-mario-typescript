import { Entity } from './entities/entity';
import { KeyboardState, PRESSED } from './keyboard-state';

export function setupKeyboard(entity: Entity) {
  const input = new KeyboardState();

  input.addMapping('Space', (keyState) => {
    if (keyState === PRESSED) {
      entity.jump.start();
    } else {
      entity.jump.cancel();
    }
  });

  input.addMapping('ArrowRight', (keyState) => {
    entity.go.direction += keyState ? 1 : -1;
  });

  input.addMapping('ArrowLeft', (keyState) => {
    entity.go.direction += keyState ? -1 : 1;
  });

  return input;
}
