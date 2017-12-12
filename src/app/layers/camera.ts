import { Camera } from '../camera';

export function createCameraLayer(cameraToDraw: Camera): (context: CanvasRenderingContext2D, camera: Camera) => void {
  return function drawLayer(context: CanvasRenderingContext2D, fromCamera: Camera) {
    context.strokeStyle = 'purple';
    context.rect(
      cameraToDraw.position.x - fromCamera.position.x,
      cameraToDraw.position.y - fromCamera.position.y,
      cameraToDraw.size.x,
      cameraToDraw.size.y);
    context.stroke();
  }
}
