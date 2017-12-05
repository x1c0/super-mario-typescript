import { Level } from './levels/level';
import { createBackgroundLayer, createSpriteLayer } from './layers/layers';
import { SpriteSheet } from './sprite-sheet';
import { createAnimation } from './animation';

export interface Tile {
  name: string,
  type: string,
  pattern: string,
  ranges: [[number, number, number, number]]
}

export interface PatternValue {
  tiles: Tile[]
}

export interface PatternKey {
  [key: string]: PatternValue
}

export interface LevelSpec {
  spriteSheet: string,
  tiles: Tile[],
  patterns: PatternKey
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

export function loadSpriteSheet(name: string) {
  return fetch(`/sprites/${name}.json`)
    .then(response => response.json())
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

export function loadLevel(levelName: string): Promise<Level> {
  return loadLevelSpec(levelName)
    .then((levelSpec: LevelSpec) =>
      Promise.all([
        levelSpec,
        loadSpriteSheet(levelSpec.spriteSheet)
      ]))
    .then(([levelSpec, backgroundSprites]) => {
      const level = new Level();

      createTiles(level, levelSpec.tiles, levelSpec.patterns);

      const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
      level.compositor.addLayer(backgroundLayer);

      const spriteLayer = createSpriteLayer(level.entities);
      level.compositor.addLayer(spriteLayer);

      return level;
    });
}

function createTiles(level: Level, tiles: Tile[], patterns: PatternKey, offsetX: number = 0, offsetY: number = 0) {

  function applyRange(tile: Tile, xStart: number, xLen: number, yStart: number, yLen: number) {
    const xEnd = xStart + xLen;
    const yEnd = yStart + yLen;

    for (let x = xStart; x < xEnd; x++) {
      for (let y = yStart; y < yEnd; y++) {
        const derivedX = x + offsetX;
        const derivedY = y + offsetY;

        if (tile.pattern) {
          const tiles = patterns[tile.pattern].tiles;
          createTiles(level, tiles, patterns, derivedX, derivedY);
        } else {
          level.tiles.set(
            derivedX,
            derivedY, {
              name: tile.name,
              type: tile.type
            });
        }
      }
    }
  }

  tiles.forEach((tile: Tile) => {
    tile.ranges.forEach((range) => {
      if (range.length === 4) {
        const [xStar, xLen, yStart, yLen] = range;
        applyRange(tile, xStar, xLen, yStart, yLen);
      } else if (range.length === 3) {
        const [xStar, xLen, yStart] = range;
        applyRange(tile, xStar, xLen, yStart, 1);
      } else if (range.length === 2) {
        const [xStar, yStart] = range;
        applyRange(tile, xStar, 1, yStart, 1);
      }
    });
  });
}