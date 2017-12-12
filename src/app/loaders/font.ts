import { loadImage } from '../loaders';
import { SpriteSheet } from '../sprite-sheet';
import { Font } from '../font';

const CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

export function loadFont() {
  return loadImage('sprites/font.png').then((image: HTMLImageElement) => {
    const fontSprite = new SpriteSheet(image, 128, 48);
    const rowLength = image.width;
    const size = 8;

    for (const [index, char] of [...CHARS].entries()) {
      const x = index * size % rowLength;
      const y = Math.floor(index * size / rowLength) * size;
      fontSprite.define(char, x, y, size, size);
    }

    return new Font(fontSprite, size);
  });
}
