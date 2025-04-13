import { Event } from '@map-angular/map-ui';
import { genRandomPoint, oneOf, randomNamber } from './utilities.js';

function generate(): Event {
  const coordinate = genRandomPoint();
  return {
    id: (Math.random() * 10000).toFixed(0), //crypto.randomUUID(),
    coordinate,
    status: oneOf('1', '2'),
    name: `אירוע ${oneOf('שריפה', 'דקירה', 'פיצוץ', 'תאונה')} ${oneOf(
      'בבית ספר',
      'בבית חולים',
      'בגן ילדים',
      'בניין מגורים'
    )}`,
    riskAssessments: {
      immediate: {
        id: (Math.random() * 10000).toFixed(0), //crypto.randomUUID(),
        bearing1: randomNamber(0, 360),
        bearing2: randomNamber(0, 360),
        radius: randomNamber(2, 5),
        xCenter: coordinate.x,
        yCenter: coordinate.y,
      },
      imminent: {
        id: (Math.random() * 10000).toFixed(0), //crypto.randomUUID(),
        bearing1: randomNamber(0, 360),
        bearing2: randomNamber(0, 360),
        radius: randomNamber(1, 3),
        xCenter: coordinate.x,
        yCenter: coordinate.y,
      },
      possible: {
        id: (Math.random() * 10000).toFixed(0), //crypto.randomUUID(),
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
