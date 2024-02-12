import {Line, lerp, line, point} from '@/domain/utils';

const INFINITY = 10000000;
type Road = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  laneCount: number;

  borders: Line[];
};

const createRoad = (x: number, width: number, laneCount: number = 3): Road => {
  const left = x - width / 2;
  const right = x + width / 2;

  const top = -INFINITY;
  const bottom = INFINITY;

  const topLeft = point(left, top);
  const topRight = point(right, top);
  const bottomLeft = point(left, bottom);
  const bottomRight = point(right, bottom);

  return {
    left,
    right,
    top,
    bottom,
    width,
    laneCount,

    borders: [line(topLeft, bottomLeft), line(topRight, bottomRight)],
  };
};

const getLaneCenter = (laneIndex: number, road: Road) => {
  const laneWidth = road.width / road.laneCount;
  return road.left + laneWidth / 2 + Math.min(laneIndex, road.laneCount - 1) * laneWidth;
};

const drawRoad = (
  ctx: CanvasRenderingContext2D,
  {left, right, top, bottom, laneCount, borders}: Road,
  delta: number
) => {
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'white';

  for (let i = 1; i < laneCount; i++) {
    const x = lerp(left, right, i / laneCount);
    if (i > 0 && i < laneCount) {
      ctx.setLineDash([20, 20]);
    }
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
    ctx.stroke();
  }

  ctx.setLineDash([]);

  borders.forEach(border => {
    ctx.beginPath();
    ctx.moveTo(border.a.x, border.a.y);
    ctx.lineTo(border.b.x, border.b.y);
    ctx.stroke();
  });
};

export {drawRoad, createRoad, getLaneCenter};
export type {Road};
