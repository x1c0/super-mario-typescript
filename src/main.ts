import './styles/main.scss';
import { loadLevel } from './loaders';
import { loadBackgroundSprites } from './sprites';
import { createBackgroundLayer, createSpriteLayer } from './layers';
import { createMario } from './entities/entities';
import { LayerCompositor } from './layer-compositor';
import { startTimer } from './timer';

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('screen');
const context: CanvasRenderingContext2D = canvas.getContext('2d');

Promise.all([
  createMario(),
  loadBackgroundSprites(),
  loadLevel('1-1')
])
  .then(([mario, backgroundSprites, level]) => {
    const gravity = 30;
    const compositor = new LayerCompositor();

    const backgroundLayer = createBackgroundLayer(level.backgrounds, backgroundSprites);
    const spriteLayer = createSpriteLayer(mario);

    compositor.addLayer(backgroundLayer);
    compositor.addLayer(spriteLayer);

    mario.position.set(64, 180);
    mario.velocity.set(200, -600);

    const update = function update(deltaTime: number) {
      compositor.draw(context);
      mario.update(deltaTime);
      mario.velocity.y += gravity;
    };

    const deltaTime = (1 / 60);
    startTimer(deltaTime, update);

  });
