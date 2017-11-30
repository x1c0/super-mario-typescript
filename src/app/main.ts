import '../styles/main.scss';
import { loadLevel } from './loaders';
import { createMario } from './entities/entities';
import { startTimer } from './timer';
import { setupKeyboard } from './input';

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('screen');
const context: CanvasRenderingContext2D = canvas.getContext('2d');

Promise.all([
  createMario(),
  loadLevel('1-1')
])
  .then(([mario, level]) => {

    mario.position.set(64, 64);
    level.entities.add(mario);

    const input = setupKeyboard(mario);
    input.listenTo(window);

    const update = function update(deltaTime: number) {
      level.update(deltaTime);
      level.compositor.draw(context);
    };

    const deltaTime = (1 / 60);
    startTimer(deltaTime, update);

  });


/* ---- DEBUG AREA ----
level.compositor.addLayer(createCollisionLayer(level));
['mousedown', 'mousemove'].forEach(eventName => {
  canvas.addEventListener(eventName, (event: MouseEvent) => {
    if (event.buttons === 1) {
      mario.velocity.set(0, 0);
      mario.position.set(event.offsetX, event.offsetY);
    }
  });
});
-------------------- */