import { Event } from '@map-angular/map-ui';
import { genRandomPoint, oneOf } from './utilities.js';

let globalId = 1;

function generat(): Event {
  const id = (globalId++).toString();
  return {
    id,
    coordinate: genRandomPoint(),
    status: oneOf<'1' | '2'>(['1', '2']),
    name: id,
  };
}

export function getEvents(length: number) {
  return Array.from({ length }).map(generat);
}
