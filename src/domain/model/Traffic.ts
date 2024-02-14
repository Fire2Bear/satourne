import {Controls} from '@/components/hooks/useControl';
import {Car, createCar, drawCar} from '@/domain/model/Car';
import {Road, getLaneCenter} from '@/domain/model/Road';

type Traffic = Car[];

const createTraffic = (road: Road, carCount: number) => {
  const cars = [];
  for (let i = 0; i < carCount; i++) {
    cars.push(createCar({x: getLaneCenter(1, road), y: -100, size: {width: 30, height: 50}, maxSpeed: 1}));
  }

  return cars;
};

const drawTraffic = (ctx: CanvasRenderingContext2D, traffic: Traffic) => {
  for (const car of traffic) {
    drawCar(car, ctx, 'red');
  }
};

const createFakeControls = (): Controls => {
  return {forward: true, left: false, right: false, reverse: false};
};

export {createTraffic, drawTraffic, createFakeControls};
export type {Traffic};
