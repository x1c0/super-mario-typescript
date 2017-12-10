import { SpriteSheet } from './sprite-sheet';
import { createAnimation } from './animation';

export function loadImage(imgPath: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const imageElem: HTMLImageElement = new Image();
    imageElem.onload = () => resolve(imageElem);
    imageElem.onerror = reject;
    imageElem.src = imgPath;
  })
}

export function loadJSON(url: string): Promise<any> {
  return fetch(url)
    .then(response => response.json());
}

export function loadSpriteSheet(name: string) {
  return loadJSON(`/sprites/${name}.json`)
    .then((sheetSpec: any) => Promise.all([
      sheetSpec,
      loadImage(sheetSpec.imageURL)
    ]))
    .then(([sheetSpec, image]) => {
      const sprites = new SpriteSheet(image, sheetSpec.tileWidth, sheetSpec.tileHeight);

      if (sheetSpec.tiles) {
        sheetSpec.tiles.forEach((tileSpec: any) => {
          sprites.defineTile(tileSpec.name, tileSpec.index[0], tileSpec.index[1]);
        });
      }

      if (sheetSpec.frames) {
        sheetSpec.frames.forEach((frameSpec: any) => {
          sprites.define(frameSpec.name, ...frameSpec.rect);
        });
      }

      if (sheetSpec.animations) {
        sheetSpec.animations.forEach((animationSpec: any) => {
          const animation = createAnimation(animationSpec.frames, animationSpec.frameLength);
          sprites.defineAnimation(animationSpec.name, animation);
        });
      }

      return sprites;
    });
}

