import { loadKoopa } from './koopa';
import { loadMario } from './mario';
import { loadGoomba } from './goomba';

export function loadEntities(): Promise<any> {
  const entityFactories: any = {};

  function addAs(name: string) {
    return (factory: any) => entityFactories[name] = factory;
  }

  return Promise.all([
    loadMario().then(addAs('mario')),
    loadGoomba().then(addAs('goomba')),
    loadKoopa().then(addAs('koopa'))
  ])
    .then(() => entityFactories);
}