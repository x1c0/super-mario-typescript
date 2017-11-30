export const RELEASED = 0;
export const PRESSED = 1;

export class KeyboardState {

  // holds the current state of a given key
  keySates: Map<string, number>;

  // holds the callback functions for a key code
  keyMap: Map<string, any>;

  constructor() {
    this.keySates = new Map();
    this.keyMap = new Map();
  }

  addMapping(code: string, callback: (keyState: number) => void) {
    this.keyMap.set(code, callback);
  }

  handleEvent(event: KeyboardEvent) {
    const { code } = event;
    if (!this.keyMap.has(code)) {
      return;
    }
    event.preventDefault();

    const keyState = event.type === 'keydown' ? PRESSED : RELEASED;

    if (this.keySates.get(code) === keyState) {
      return;
    }

    this.keySates.set(code, keyState);
    this.keyMap.get(code)(keyState);
  }

  listenTo(window: Window) {
    ['keydown', 'keyup'].forEach((eventName: string) => {
      window.addEventListener(eventName, event => {
        this.handleEvent(<KeyboardEvent>event);
      });
    })

  }
}