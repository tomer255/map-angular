type Point = { x: number; y: number };

function inside(point: Point, vs: Point[]) {
  const { x, y } = point;

  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const { x: xi, y: yi } = vs[i];
    const { x: xj, y: yj } = vs[j];

    const intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

const polygon = [
  { x: 34.933874, y: 29.651273 },
  { x: 34.329626, y: 31.216824 },
  { x: 34.834997, y: 31.974881 },
  { x: 34.994299, y: 32.765897 },
  { x: 35.120641, y: 32.782376 },
  { x: 35.148107, y: 33.046048 },
  { x: 35.549108, y: 33.046048 },
  { x: 35.576574, y: 33.210843 },
  { x: 35.746862, y: 33.227322 },
  { x: 35.801794, y: 32.848264 },
  { x: 35.510656, y: 32.678006 },
];
const min_x = Math.min(...polygon.map((v) => v.x));
const max_x = Math.max(...polygon.map((v) => v.x));
const min_y = Math.min(...polygon.map((v) => v.y));
const max_y = Math.max(...polygon.map((v) => v.y));

export function randomNamber(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function randomPoint(): Point {
  return { x: randomNamber(min_x, max_x), y: randomNamber(min_y, max_y) };
}

export function genRandomPoint(): Point {
  const point = randomPoint();
  if (!inside(point, polygon)) return genRandomPoint();
  return point;
}

export function oneOf<T>(arr: T[]) {
  const index = Math.floor(randomNamber(0, arr.length));
  return arr[index];
}
