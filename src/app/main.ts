import '../styles/main.scss';

import { startTimer } from './timer';
import { setupKeyboard } from './input';
import { Camera } from './camera';
import { createLevelLoader } from './loaders/level';
import { loadEntities } from './entities/entities';
import { Entity } from './entities/entity';
import { PlayerController } from './traits/player-controller';
import { loadFont } from './loaders/font';
import { createDashboardLayer } from './layers/dashboard';

function createPlayerEnvironment(player: Entity): Entity {
  const playerEnv = new Entity();
  const playerControl = new PlayerController();
  playerControl.ckeckpoint.set(64, 64);
  playerControl.setPlayer(player);
  playerEnv.addTrait(playerControl);
  return playerEnv;
}

async function main(canvas: HTMLCanvasElement) {
  const context: CanvasRenderingContext2D = canvas.getContext('2d');

  const [entityFactory, font] = await Promise.all([loadEntities(), loadFont()]);
  const loadLevel = await createLevelLoader(entityFactory);
  const level = await loadLevel('1-1');

  const camera = new Camera();
  const mario = entityFactory.mario();

  // debug layer -> level.compositor.addLayer(createCollisionLayer(level));
  // level.compositor.addLayer(createCameraLayer(camera));

  const playerEnv = createPlayerEnvironment(mario);
  level.entities.add(playerEnv);

  level.compositor.addLayer(createDashboardLayer(font, playerEnv));

  const input = setupKeyboard(mario);
  input.listenTo(window);

  const update = function update(deltaTime: number) {
    level.update(deltaTime);

    camera.position.x = Math.max(0, mario.position.x - 100);

    level.compositor.draw(context, camera);
  };

  const deltaTime = (1 / 60);
  startTimer(deltaTime, update);
}

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('screen');
main(canvas);