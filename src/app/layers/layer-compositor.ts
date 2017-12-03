import { Camera } from '../camera';

export class LayerCompositor {

  // array of functions - each function knows how to draw a layer
  private layers: { (context: CanvasRenderingContext2D, camera: Camera): void; } [] = [];

  constructor() {
    this.layers = [];
  }

  addLayer(layer: (context: CanvasRenderingContext2D, camera: Camera) => void) {
    this.layers.push(layer);
  }

  draw(context: CanvasRenderingContext2D, camera: Camera) {
    this.layers.forEach(layer => {
      layer(context, camera);
    })
  }
}