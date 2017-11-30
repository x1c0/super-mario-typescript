import { SpriteSheet } from './sprite-sheet';
import { loadImage } from '../loaders';
import backgrounds from '../../images/tileset.png';
import characters from '../../images/characters.gif';

export function loadMarioSprite() {
  return loadImage(characters)
    .then((image: HTMLImageElement) => {
      const sprites = new SpriteSheet(image, 16, 16);
      sprites.define('idle', 276, 44, 16, 16);
      return sprites;
    });
}

export function loadBackgroundSprites() {
  return loadImage(backgrounds)
    .then((image: HTMLImageElement) => {
      const sprites = new SpriteSheet(image, 16, 16);
      sprites.defineTile('ground', 0, 0);
      sprites.defineTile('sky', 3, 23);
      return sprites;
    });
}