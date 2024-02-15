import {useControl} from '@/components/hooks/useControl';
import {Car, convertOutputsToControls, createCar, drawCar, getBestCar, updateCarFromControls} from '@/domain/model/Car';
import {mutateNetwork, updateNetwork} from '@/domain/model/Network';
import {Road, getLaneCenter} from '@/domain/model/Road';
import {updateSensorWithCar, drawSensorInContext} from '@/domain/model/Sensor';
import {Traffic} from '@/domain/model/Traffic';
import {useCallback, useEffect, useRef} from 'react';

type Props = {
  carCount: number;
  road: Road;
};

const useCars = ({carCount, road}: Props) => {
  const initCars = (carCount: number) => {
    const cars = Array.from({length: carCount}).map(() =>
      createCar({
        x: getLaneCenter(1, road),
        sensorCount: 10,
        networkLevelCount: 2,
      })
    );
    return cars;
  };
  const carRefs = useRef<Car[]>(initCars(carCount));

  useEffect(() => {
    if (localStorage.getItem('bestBrain')) {
      // @ts-ignore
      const bestBrain: Network = JSON.parse(localStorage.getItem('bestBrain'));
      for (let i = 0; i < carRefs.current.length; i++) {
        carRefs.current[i].network = bestBrain;
        if (i != 0) {
          carRefs.current[i].network = mutateNetwork(carRefs.current[i].network, 0.2);
        }
      }
    }
  }, [carRefs]);

  const {controlsRef} = useControl();

  const brainRef = useRef(true);

  const updateCar = useCallback(
    (car: Car, road: Road, traffic: Traffic, delta: number) => {
      const {left, right, forward, reverse} = controlsRef.current;

      // console.log(car);

      if (left || right || forward || reverse) {
        brainRef.current = false;
      } else {
        brainRef.current = true;
      }

      car.sensor = updateSensorWithCar(car, traffic, road);
      const offsets = car.sensor.readings.map(reading => (reading === null ? 0 : 1 - reading.offset));

      const {outputs, network} = updateNetwork(offsets, car.network);
      car.network = network;
      const brainControls = convertOutputsToControls(outputs);

      return {
        ...car,
        ...updateCarFromControls(
          car,
          brainRef.current ? brainControls : controlsRef.current,
          road.borders,
          traffic,
          delta
        ),
      };
    },
    [controlsRef, brainRef]
  );

  const updateCars = useCallback(
    (road: Road, traffic: Traffic, delta: number) => {
      const newCars: Car[] = [];

      for (const car of carRefs.current) {
        newCars.push(updateCar(car, road, traffic, delta));
      }
      carRefs.current = newCars;
    },
    [carRefs, updateCar]
  );

  const drawCarInContext = useCallback((ctx: CanvasRenderingContext2D, car: Car, bestCar: boolean) => {
    if (!bestCar) ctx.globalAlpha = 0.2;
    drawCar(car, ctx, 'blue');
    if (bestCar) drawSensorInContext(ctx, car.sensor);
    if (!bestCar) ctx.globalAlpha = 1;
  }, []);

  const drawCars = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const bestCar = getBestCar(carRefs.current);

      for (const car of carRefs.current) {
        drawCarInContext(ctx, car, bestCar.id === car.id);
      }
    },
    [drawCarInContext, carRefs]
  );

  return {carRefs, drawCars, updateCars};
};

export {useCars};
export type {Car};
