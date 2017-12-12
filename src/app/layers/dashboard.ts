import { Font } from '../font';
import { Entity } from '../entities/entity';

export function createDashboardLayer(font: Font, playerEnv: Entity): (context: CanvasRenderingContext2D) => void {
  const LINE1 = font.fontSize;
  const LINE2 = font.fontSize * 2;
  const coins = 5;

  return function drawLayer(context: CanvasRenderingContext2D) {
    const {time, score} = playerEnv.playerController;

    font.print('MARIO', context, 16, LINE1);
    font.print(score.toString().padStart(6, '0'), context, 16, LINE2);

    font.print('@x' + coins.toString().padStart(2, '0'), context, 96, LINE2);

    font.print('WORLD', context, 152, LINE1);
    font.print('1-1', context, 160, LINE2);

    font.print('TIME', context, 208, LINE1);
    font.print(time.toFixed(0).toString().padStart(3, '0'), context, 216, LINE2);
  }
}
