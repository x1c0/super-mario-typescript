import { Camera } from '../camera';
import { CanvasHelper } from '../canvas-helper';
import { Entity } from '../entities/entity';

export function createSpriteLayer(entities: Set<Entity>, width: number = 64, height: number = 64): (context: CanvasRenderingContext2D, camera: Camera) => void {
  const spriteCanvas = new CanvasHelper(width, height);
  return function drawLayer(mainContext: CanvasRenderingContext2D, camera: Camera) {
    entities.forEach((entity: Entity) => {
      // clear the spriteCanvas context
      spriteCanvas.context.clearRect(0, 0, width, height);

      entity.draw(spriteCanvas.context);

      mainContext.drawImage(
        spriteCanvas.buffer,
        entity.position.x - camera.position.x,
        entity.position.y - camera.position.y);
    });
  }
}
