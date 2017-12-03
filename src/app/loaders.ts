import { Level } from './levels/level';
import { createBackgroundLayer, createSpriteLayer } from './layers/layers';
import { loadBackgroundSprites } from './sprites/sprites';

export interface Background {
  tile: string,
  ranges: [[number, number, number, number]]
}

export interface LevelSpec {
  backgrounds: Background[]
}

export function loadImage(imgPath: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const imageElem: HTMLImageElement = new Image();
    imageElem.onload = () => resolve(imageElem);
    imageElem.onerror = reject;
    imageElem.src = imgPath;
  })
}

function loadLevelSpec(levelName: string): Promise<LevelSpec> {
  return fetch(`/levels/${levelName}.json`)
    .then(response => response.json());
}

function createTiles(level: any, backgrounds: Background[]) {

  function applyRange(background: Background, xStart: number, xLen: number, yStart: number, yLen: number) {
    const xEnd = xStart + xLen;
    const yEnd = yStart + yLen;

    for (let x = xStart; x < xEnd; x++) {
      for (let y = yStart; y < yEnd; y++) {
        level.tiles.set(x, y, {
          name: background.tile
        });
      }
    }
  }

  backgrounds.forEach((background: Background) => {
    background.ranges.forEach((range) => {
      if (range.length === 4) {
        const [xStar, xLen, yStart, yLen] = range;
        applyRange(background, xStar, xLen, yStart, yLen);
      } else if (range.length === 3) {
        const [xStar,xLen, yStart] = range;
        applyRange(background, xStar, xLen, yStart, 1);
      } else if (range.length === 2) {
        const [xStar, yStart] = range;
        applyRange(background, xStar, 1, yStart, 1);
      }
    });
  });
}

export function loadLevel(levelName: string): Promise<Level> {
  return Promise.all([
    loadLevelSpec(levelName),
    loadBackgroundSprites()
  ]).then(([levelSpec, backgroundSprites]) => {
    const level = new Level();

    createTiles(level, levelSpec.backgrounds);

    const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
    level.compositor.addLayer(backgroundLayer);

    const spriteLayer = createSpriteLayer(level.entities);
    level.compositor.addLayer(spriteLayer);

    return level;
  });
}
