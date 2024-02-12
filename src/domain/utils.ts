const lerp = (A: number, B: number, T: number) => {
  return A + (B - A) * T;
};

type Point = {
  x: number;
  y: number;
};
const point = (x: number, y: number) => {
  return {
    x,
    y,
  };
};

type Line = {
  a: Point;
  b: Point;
};

const line = (a: Point, b: Point) => {
  return {
    a,
    b,
  };
};

type Reading = {x: number; y: number; offset: number};

const getIntersection = (A: Point, B: Point, C: Point, D: Point): Reading | null => {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }

  return null;
};

export {lerp, point, line, getIntersection};
export type {Point, Line, Reading};
