import { Matrix } from './math/matrix';
import { Vector } from './math/vector';

export class TileResolver {

  matrix: Matrix;
  tileSize: number;

  constructor(matrix: Matrix, tileSize: number = 16) {
    this.matrix = matrix;
    this.tileSize = tileSize;
  }

  toIndex(position: number) {
    return Math.floor(position / this.tileSize);
  }

  toIndexRange(pos1: number, pos2: number) {
    const pMax = Math.ceil(pos2 / this.tileSize) * this.tileSize;
    const range: any[] = [];
    let pos = pos1;
    do {
      range.push(this.toIndex(pos));
      pos += this.tileSize;
    } while (pos < pMax);
    return range;
  }

  getByIndex(indexX: number, indexY: number) {
    const tile = this.matrix.get(indexX, indexY);
    const x1 = indexX * this.tileSize;
    const x2 = x1 + this.tileSize;
    const y1 = indexY * this.tileSize;
    const y2 = y1 + this.tileSize;

    if (tile) {
      return {
        tile,
        x1,
        x2,
        y1,
        y2
      }
    }
  }

  searchByPosition(position: Vector) {
    return this.getByIndex(this.toIndex(position.x), this.toIndex(position.y));
  }

  searchByRange(x1: number, x2: number, y1: number, y2: number) {
    const matches: any[] = [];
    this.toIndexRange(x1, x2).forEach((indexX: number) => {
      this.toIndexRange(y1, y2).forEach((indexY: number) => {
        const match = this.getByIndex(indexX, indexY);
        if (match) {
          matches.push(match);
        }
      });
    });
    return matches;
  }

}
