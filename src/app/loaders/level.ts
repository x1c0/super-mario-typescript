import { Level } from '../levels/level';
import { createBackgroundLayer, createSpriteLayer } from '../layers/layers';
import { loadJSON, loadSpriteSheet } from '../loaders';
import { Matrix } from '../math/matrix';
import { SpriteSheet } from '../sprite-sheet';

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

export interface EntitySpec {
  name: string,
  position: [number, number]
}

export interface LevelSpec {
  spriteSheet: string,
  layers: Layer[],
  patterns: PatternKey,
  entities: EntitySpec[]
}

function setupLevelCollision(levelSpec: LevelSpec, level: Level) {
  const mergedTiles: Tile[] = levelSpec.layers.reduce((mergedTiles: Tile[], layer: Layer) => {
    return mergedTiles.concat(layer.tiles);
  }, []);

  const collisionGrid = createCollisionGrid(mergedTiles, levelSpec.patterns);
  level.setCollisionGrid(collisionGrid);
}

function setupBackground(levelSpec: LevelSpec, level: Level, backgroundSprites: SpriteSheet) {
  levelSpec.layers.forEach((layer: Layer) => {
    const backgroundGrid = createBackgroundGrid(layer.tiles, levelSpec.patterns);
    const backgroundLayer = createBackgroundLayer(level, backgroundGrid, backgroundSprites);
    level.compositor.addLayer(backgroundLayer);
  });
}

function setupEntities(levelSpec: LevelSpec, level: Level, entityFactory: any) {
  levelSpec.entities.forEach(({ name, position: [x, y] }: EntitySpec) => {
    const createEntity = entityFactory[name];
    const entity = createEntity();
    entity.position.set(x, y);
    level.entities.add(entity);
  });
  const spriteLayer = createSpriteLayer(level.entities);
  level.compositor.addLayer(spriteLayer);
}

export function createLevelLoader(entityFactory: any): (levelName: string) => Promise<Level> {
  return function loadLevel(levelName: string): Promise<Level> {
    return loadJSON(`/levels/${levelName}.json`)
      .then((levelSpec: LevelSpec) =>
        Promise.all([
          levelSpec,
          loadSpriteSheet(levelSpec.spriteSheet)
        ]))
      .then(([levelSpec, backgroundSprites]) => {
        const level = new Level();

        setupLevelCollision(levelSpec, level);
        setupBackground(levelSpec, level, backgroundSprites);
        setupEntities(levelSpec, level, entityFactory);

        return level;
      });
  }
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
    yield* expandRange(range);
  }
}

function* expandTiles(tiles: Tile[], patterns: PatternKey) {
  function* walkTiles(tiles: Tile[], offsetX: number, offsetY: number): any {
    for (const tile of tiles) {
      for (const { x, y } of expandRanges(tile.ranges)) {
        const derivedX = x + offsetX;
        const derivedY = y + offsetY;

        if (tile.pattern) {
          const patternTiles = patterns[tile.pattern].tiles;
          yield* walkTiles(patternTiles, derivedX, derivedY);
        } else {
          yield {
            tile,
            x: derivedX,
            y: derivedY
          };
        }
      }
    }
  }

  yield* walkTiles(tiles, 0, 0);
}