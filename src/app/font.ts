import { SpriteSheet } from './sprite-sheet';

export class Font {

  fontSprite: SpriteSheet;
  fontSize: number;

  constructor(fontSprite: SpriteSheet, fontSize: number) {
    this.fontSprite = fontSprite;
    this.fontSize = fontSize;
  }

  print(text: string, context: CanvasRenderingContext2D, x: number, y: number) {
    [...text].forEach((char: string, index: number) => {
      this.fontSprite.draw(char, context, x + index * this.fontSize, y);
    });
  }

}
