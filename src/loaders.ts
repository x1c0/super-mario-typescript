export interface Background {
  tile: string,
  ranges: [[number, number, number, number]]
}

export interface Level {
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

export function loadLevel(levelName: string): Promise<Level> {
  return fetch(`/levels/${levelName}.json`)
    .then(response => response.json());
}
