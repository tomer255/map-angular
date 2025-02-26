import { Ellipse } from '@map-angular/map-ui';
import { genRandomPoint, randomNamber } from './utilities.js';

function generat(): Ellipse {
  const { x, y } = genRandomPoint();
  return {
    id: crypto.randomUUID(),
    xCenter: x,
    yCenter: y,
    xSemiAxis: randomNamber(3, 10),
    ySemiAxis: randomNamber(3, 10),
    angle: randomNamber(0, 360),
    time: new Date(),
  };
}

export function getEllipses(length: number) {
  return Array.from({ length }).map(generat);
}
