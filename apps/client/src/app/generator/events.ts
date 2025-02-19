import { Event } from '@map-angular/map-ui';
import { genRandomPoint, oneOf } from './utilities.js';

function generat(): Event {
  return {
    id: crypto.randomUUID(),
    coordinate: genRandomPoint(),
    status: oneOf<'1' | '2'>('1', '2'),
    name: `אירוע ${oneOf('שירפה', 'דקירה', 'פיצוץ', 'תאונה')} ${oneOf(
      'בבית ספר',
      'בבית חולים',
      'בגן ילדים'
    )}`,
  };
}

export function getEvents(length: number) {
  return Array.from({ length }).map(generat);
}
