import '../styles/main.scss';

import { startTimer } from './timer';
import { setupKeyboard } from './input';
import { Camera } from './camera';
import { createLevelLoader } from './loaders/level';
import { loadEntities } from './entities/entities';

async function main(canvas: HTMLCanvasElement) {
  const context: CanvasRenderingContext2D = canvas.getContext('2d');

  const entityFactory = await loadEntities();
  const loadLevel = await createLevelLoader(entityFactory);
  const level = await loadLevel('1-1');

  const camera = new Camera();
  const mario = entityFactory.mario();
  mario.position.set(64, 64);

  // debug layer -> level.compositor.addLayer(createCollisionLayer(level));
  // level.compositor.addLayer(createCameraLayer(camera));
  level.entities.add(mario);

  const input = setupKeyboard(mario);
  input.listenTo(window);

  const update = function update(deltaTime: number) {
    level.update(deltaTime);

    if (mario.position.x > 100) {
      camera.position.x = mario.position.x - 100;
    }

    level.compositor.draw(context, camera);
  };

  const deltaTime = (1 / 60);
  startTimer(deltaTime, update);
}

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('screen');
main(canvas);