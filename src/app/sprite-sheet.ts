import { CanvasHelper } from './canvas-helper';

export class SpriteSheet {

  image: HTMLImageElement;
  width: number;
  height: number;
  tiles: Map<string, HTMLCanvasElement[]>;
  animations: Map<string, any>;

  constructor(image: HTMLImageElement, width: number, height: number) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.tiles = new Map();
    this.animations = new Map();
  }

  defineAnimation(name: string, animation: any) {
    this.animations.set(name, animation);
  }

  define(name: string, x: number, y: number, width: number, height: number): void;
  define(name: string, ...args: number[]): void;
  define(name: string, x: number, y: number, width: number, height: number) {
    const buffers = [false, true].map((flip: boolean) => {
      const canvasHelper = new CanvasHelper(width, height);
      const context = canvasHelper.context;

      if (flip) {
        context.scale(-1, 1);
        context.translate(-width, 0);
      }

      context.drawImage(
        this.image,
        x, y,
        width, height,
        0, 0,
        width, height);

      return canvasHelper.buffer;
    });

    this.tiles.set(name, buffers);
  }

  defineTile(name: string, x: number, y: number) {
    this.define(name, x * this.width, y * this.height, this.width, this.height);
  }

  draw(name: string, context: CanvasRenderingContext2D, x: number, y: number, flip = false) {
    if(!this.tiles.get(name)){
      console.error(`tile ${name} not found`);
      return;
    }
    const buffer: HTMLCanvasElement = this.tiles.get(name)[flip ? 1 : 0];
    context.drawImage(buffer, x, y);
  }

  drawTile(name: string, context: CanvasRenderingContext2D, x: number, y: number) {
    this.draw(name, context, x * this.width, y * this.height);
  }

  drawAnimation(name: string, context: CanvasRenderingContext2D, x: number, y: number, distance: number) {
    const animation = this.animations.get(name);
    this.drawTile(animation(distance), context, x, y);
  }

}
