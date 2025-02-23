import { Event } from '@map-angular/map-ui';
import { genRandomPoint, oneOf, randomNamber } from './utilities.js';

function generate(): Event {
  const coordinate = genRandomPoint();
  return {
    id: crypto.randomUUID(),
    coordinate,
    status: oneOf('1', '2'),
    name: `אירוע ${oneOf('שריפה', 'דקירה', 'פיצוץ', 'תאונה')} ${oneOf(
      'בבית ספר',
      'בבית חולים',
      'בגן ילדים',
      'בינין מגורים'
    )}`,
    riskAssessments: {
      immediate: {
        id: crypto.randomUUID(),
        bearing1: randomNamber(0, 360),
        bearing2: randomNamber(0, 360),
        radius: randomNamber(2, 5),
        xCenter: coordinate.x,
        yCenter: coordinate.y,
      },
      imminent: {
        id: crypto.randomUUID(),
        bearing1: randomNamber(0, 360),
        bearing2: randomNamber(0, 360),
        radius: randomNamber(1, 3),
        xCenter: coordinate.x,
        yCenter: coordinate.y,
      },
      possible: {
        id: crypto.randomUUID(),
        bearing1: randomNamber(0, 360),
        bearing2: randomNamber(0, 360),
        radius: randomNamber(3, 10),
        xCenter: coordinate.x,
        yCenter: coordinate.y,
      },
    },
  };
}

export function getEvents(length: number) {
  return Array.from({ length }).map(generate);
}
