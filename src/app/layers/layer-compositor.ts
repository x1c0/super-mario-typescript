export class LayerCompositor {

  private layers: any[] = [];

  constructor() {
    this.layers = [];
  }

  addLayer(layer: any) {
    this.layers.push(layer);
  }

  draw(context: CanvasRenderingContext2D) {
    this.layers.forEach(layer => {
      layer(context);
    })
  }
}