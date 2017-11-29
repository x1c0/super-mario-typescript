export function startTimer(deltaTime: number, fn: (deltaTime: number) => void) {

  let accumulatedTime: number = 0;
  let lastTime: number = 0;

  function updateProxy(time: number) {
    accumulatedTime += (time - lastTime) / 1000;

    while (accumulatedTime > deltaTime) {
      fn(deltaTime);
      accumulatedTime -= deltaTime;
    }
    lastTime = time;
    requestAnimationFrame(updateProxy);
  }

  requestAnimationFrame(updateProxy);
}
