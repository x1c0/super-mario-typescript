import '../styles/main.scss';
import { loadLevel } from './loaders';
import { createMario } from './entities/entities';
import { startTimer } from './timer';
import { setupKeyboard } from './input';
import { createCameraLayer, createCollisionLayer } from './layers/layers';
import { Camera } from './camera';
import { setupMouseControls } from './debug';

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('screen');
const context: CanvasRenderingContext2D = canvas.getContext('2d');

Promise.all([
  createMario(),
  loadLevel('1-1')
])
  .then(([mario, level]) => {

    const camera = new Camera();
    mario.position.set(64, 64);

    level.compositor.addLayer(createCollisionLayer(level));
    level.compositor.addLayer(createCameraLayer(camera));
    level.entities.add(mario);

    const input = setupKeyboard(mario);
    input.listenTo(window);

    setupMouseControls(canvas, mario, camera);

    const update = function update(deltaTime: number) {
      level.update(deltaTime);
      level.compositor.draw(context, camera);
    };

    const deltaTime = (1 / 60);
    startTimer(deltaTime, update);

  });
