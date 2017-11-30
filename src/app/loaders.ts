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
  backgrounds.forEach((background: Background) => {
    background.ranges.forEach(([x1, x2, y1, y2]) => {
      for (let x = x1; x < x2; x++) {
        for (let y = y1; y < y2; y++) {
          level.tiles.set(x, y, {
            name: background.tile
          });
        }
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
