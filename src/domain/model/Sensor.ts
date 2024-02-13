import {Car} from '@/domain/model/Car';
import {Road} from '@/domain/model/Road';
import {Line, Touch, getIntersection, lerp, line, point} from '@/domain/utils';

type Sensor = {
  rayCount: number;
  rayLength: number;
  raySpread: number;

  rays: Line[];
  readings: (Touch | null)[];
};

const createSensor = (sensor: Partial<Sensor>): Sensor => {
  return {
    rayCount: 5,
    rayLength: 150,
    raySpread: Math.PI / 2,

    rays: [],
    readings: [],
  };
};

const updateSensor = (car: Car, sensor: Sensor, roadBorders: Road['borders']) => {
  const rays = castRays(car, sensor, roadBorders);

  const readings = [];
  for (let i = 0; i < rays.length; i++) {
    const ray = rays[i];
    const reading = getReading(ray, roadBorders);

    readings.push(reading);
  }

  return {...sensor, rays, readings};
};

const getReading = (ray: Line, roadBorders: Road['borders']) => {
  const touches = [];

  for (const border of roadBorders) {
    const touch = getIntersection(ray.a, ray.b, border.a, border.b);
    if (touch) {
      touches.push(touch);
    }
  }

  if (touches.length === 0) {
    return null;
  }

  return touches.reduce((minOffset, currTouch) => (currTouch.offset > minOffset.offset ? minOffset : currTouch));
};

const castRays = (car: Car, sensor: Sensor, borders: Road['borders']) => {
  const rays = [];

  for (let i = 0; i < sensor.rayCount; i++) {
    const rayAngle =
      lerp(sensor.raySpread / 2, -sensor.raySpread / 2, sensor.rayCount == 1 ? 0.5 : i / (sensor.rayCount - 1)) +
      car.angle;
    const start = point(car.x, car.y);
    const end = point(car.x - Math.sin(rayAngle) * sensor.rayLength, car.y - Math.cos(rayAngle) * sensor.rayLength);

    rays.push(line(start, end));
  }
  return rays;
};

const drawSensor = (ctx: CanvasRenderingContext2D, sensor: Sensor) => {
  for (const [i, ray] of sensor.rays.entries()) {
    let end = ray.b;
    if (sensor.readings[i] !== null) {
      end = sensor.readings[i] as Touch;
    }

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'yellow';
    ctx.moveTo(ray.a.x, ray.a.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.moveTo(ray.b.x, ray.b.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
};

export {createSensor, drawSensor, updateSensor};
export type {Sensor};
