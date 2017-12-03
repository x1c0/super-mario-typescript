export function createAnimation(frames: string[], frameLength: number) {
  return function resolveFrame(distance: number) {
    const frameIndex: number = Math.floor(distance / frameLength) % frames.length;
    const frameName: string = frames[frameIndex];
    return frameName;
  }
}
