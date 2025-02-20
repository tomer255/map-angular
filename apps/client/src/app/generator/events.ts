import { Event } from '@map-angular/map-ui';
import { genRandomPoint, oneOf } from './utilities.js';

function generate(): Event {
  return {
    id: crypto.randomUUID(),
    coordinate: genRandomPoint(),
    status: oneOf('1', '2'),
    name: `אירוע ${oneOf('שריפה', 'דקירה', 'פיצוץ', 'תאונה')} ${oneOf(
      'בבית ספר',
      'בבית חולים',
      'בגן ילדים',
      'בינין מגורים'
    )}`,
  };
}

export function getEvents(length: number) {
  return Array.from({ length }).map(generate);
}
