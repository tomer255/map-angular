import { Force } from '@map-angular/map-ui';
import { genRandomPoint, oneOf } from './utilities.js';

function generate(): Force {
  const coordinate = genRandomPoint();
  return {
    id: (Math.random() * 10000).toFixed(0), //crypto.randomUUID(),
    coordinate,
    type: oneOf('1', '2'),
    level: oneOf('1', '2'),
    name: `כוח`,
  };
}

export function getforces(length: number) {
  return Array.from({ length }).map(generate);
}
