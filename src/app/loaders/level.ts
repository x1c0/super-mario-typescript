import { Level } from '../levels/level';
import { createBackgroundLayer, createSpriteLayer } from '../layers/layers';
import { loadJSON, loadSpriteSheet } from '../loaders';
import { Matrix } from '../math/matrix';

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

export interface Layer {
  tiles: Tile[]
}

export interface LevelSpec {
  spriteSheet: string,
  layers: Layer[],
  patterns: PatternKey
}

export function loadLevel(levelName: string): Promise<Level> {
  return loadJSON(`/levels/${levelName}.json`)
    .then((levelSpec: LevelSpec) =>
      Promise.all([
        levelSpec,
        loadSpriteSheet(levelSpec.spriteSheet)
      ]))
    .then(([levelSpec, backgroundSprites]) => {
      const level = new Level();

      const mergedTiles: Tile[] = levelSpec.layers.reduce((mergedTiles: Tile[], layer: Layer) => {
        return mergedTiles.concat(layer.tiles);
      }, []);

      const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);
      level.setCollisionGrid(collisionGrid);

      levelSpec.layers.forEach((layer: Layer) => {
        const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns);
        const backgroundLayer = createBackgroundLayer(level, backgroundGrid, backgroundSprites);
        level.compositor.addLayer(backgroundLayer);

      });
      const spriteLayer = createSpriteLayer(level.entities);
      level.compositor.addLayer(spriteLayer);

      return level;
    });
}

function createCollisionGrid(tiles: Tile[], patterns: PatternKey) {
  const grid = new Matrix();

  for (const { tile, x, y } of expandTiles(tiles, patterns)) {
    grid.set(x, y, { type: tile.type });
  }

  return grid;
}

function createBackgroundGrid(tiles: Tile[], patterns: PatternKey) {
  const grid = new Matrix();

  for (const { tile, x, y } of expandTiles(tiles, patterns)) {
    grid.set(x, y, { name: tile.name });
  }

  return grid;
}

function* expandSpan(xStart: number, xLen: number, yStart: number, yLen: number) {
  const xEnd = xStart + xLen;
  const yEnd = yStart + yLen;

  for (let x = xStart; x < xEnd; x++) {
    for (let y = yStart; y < yEnd; y++) {
      yield { x, y };
    }
  }
}

function expandRange(range: [number, number, number, number]) {
  if (range.length === 4) {
    const [xStar, xLen, yStart, yLen] = range;
    return expandSpan(xStar, xLen, yStart, yLen);
  }
  if (range.length === 3) {
    const [xStar, xLen, yStart] = range;
    return expandSpan(xStar, xLen, yStart, 1);
  }
  if (range.length === 2) {
    const [xStar, yStart] = range;
    return expandSpan(xStar, 1, yStart, 1);
  }
}

function* expandRanges(ranges: [[number, number, number, number]]) {
  for (const range of ranges) {
    for (const item of expandRange(range)) {
      yield item;
    }
  }
}

function expandTiles(tiles: Tile[], patterns: PatternKey) {
  const expandedTiles: any[] = [];

  function walkTiles(tiles: Tile[], offsetX: number, offsetY: number) {
    for (const tile of tiles) {
      for (const { x, y } of expandRanges(tile.ranges)) {
        const derivedX = x + offsetX;
        const derivedY = y + offsetY;

        if (tile.pattern) {
          const patternTiles = patterns[tile.pattern].tiles;
          walkTiles(patternTiles, derivedX, derivedY);
        } else {
          expandedTiles.push({
            tile,
            x: derivedX,
            y: derivedY
          });
        }
      }
    }
  }

  walkTiles(tiles, 0, 0);

  return expandedTiles;
}