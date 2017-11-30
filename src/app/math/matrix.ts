export class Matrix {

  grid: any[];

  constructor() {
    this.grid = [];
  }

  forEachTile(callback: (tile: any, x: number, y: number) => void) {
    this.grid.forEach((column: any[], x: number) => {
      column.forEach((value: any, y: number) => {
        callback(value, x, y);
      });
    });
  }

  set(x: number, y: number, value: any) {
    if (!this.grid[x]) {
      this.grid[x] = [];
    }
    this.grid[x][y] = value;
  }

  get(x: number, y: number) {
    const column = this.grid[x];
    if (column) {
      return column[y];
    }
    return undefined;
  }

}