import '../styles/main.scss';

import { startTimer } from './timer';
import { setupKeyboard } from './input';
import { Camera } from './camera';
import { loadLevel } from './loaders/level';
import { loadEntities } from './entities/entities';

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('screen');
const context: CanvasRenderingContext2D = canvas.getContext('2d');

Promise.all([
  loadEntities(),
  loadLevel('1-1')
])
  .then(([entity, level]) => {
    const camera = new Camera();
    const mario = entity.mario();
    const goomba = entity.goomba();
    const koopa = entity.koopa();

    mario.position.set(64, 64);
    goomba.position.set(220, 64);
    koopa.position.set(360, 64);

    // debug layer -> level.compositor.addLayer(createCollisionLayer(level));
    // level.compositor.addLayer(createCameraLayer(camera));
    level.entities.add(mario);
    level.entities.add(goomba);
    level.entities.add(koopa);

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

  });
