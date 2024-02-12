import {Controls} from '@/components/hooks/useControl';

type Car = {
  speed: number;
  x: number;
  y: number;
  angle: number;
};

const MAX_SPEED = 2;
const FRICTION = 0.5;

const CAR_WIDTH = 30;
const CAR_HEIGHT = 50;

const createCar = ({speed, x, y, angle}: Partial<Car>): Car => {
  return {
    speed: speed ?? 0,
    x: x ?? 100,
    y: y ?? 100,
    angle: angle ?? 0,
  };
};

const updateCarFromControls = (car: Car, controls: Controls, delta: number): Car => {
  let {x, y, angle, speed} = car;
  const movedCar = move(car, controls, delta);

  return {...movedCar};
  // requestAnimationFrame(updatePosition)
};

const move = (car: Car, {forward, left, right, reverse}: Controls, delta: number) => {
  let {x, y, angle, speed} = car;

  const deltaPercentage = delta / 100;
  const currentFriction = FRICTION * deltaPercentage;

  const acceleration = (forward ? 1 : reverse ? -1 : 0) * deltaPercentage;

  speed = car.speed + acceleration;
  if (speed > MAX_SPEED) speed = MAX_SPEED;
  if (speed < -MAX_SPEED / 2) speed = -MAX_SPEED / 2;

  if (speed > 0) speed -= currentFriction;
  if (speed < 0) speed += currentFriction;

  if (speed !== 0) {
    const flip = speed > 0 ? 1 : -1;
    const angleModif = right ? -0.03 : left ? 0.03 : 0;
    angle += angleModif * flip;
  }

  if (Math.abs(speed) < currentFriction) speed = 0;

  const newCar: Car = createCar({
    ...car,
    speed,
    angle,
    x: x - Math.sin(angle) * speed,
    y: y - Math.cos(angle) * speed,
  });

  return newCar;
};

const drawCar = (car: Car, ctx: CanvasRenderingContext2D) => {
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(-car.angle);

  ctx.beginPath();
  ctx.rect(-CAR_WIDTH / 2, -CAR_HEIGHT / 2, CAR_WIDTH, CAR_HEIGHT);
  ctx.fill();

  ctx.restore();
};

export {createCar, drawCar, updateCarFromControls};
export type {Car};
