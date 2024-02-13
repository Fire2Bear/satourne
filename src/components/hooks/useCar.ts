import {Controls} from '@/components/hooks/useControl';
import {useSensor} from '@/components/hooks/useSensor';
import {Car, drawCar, updateCarFromControls} from '@/domain/model/Car';
import {Road} from '@/domain/model/Road';
import {createSensor} from '@/domain/model/Sensor';
import {useCallback, useRef} from 'react';

const useCar = (car: Car) => {
  const {sensorRef, drawSensorInContext, updateSensorWithCar} = useSensor(createSensor({}));
  const carRef = useRef<Car>(car);

  const updateCar = useCallback(
    (controls: Controls, road: Road, delta: number) => {
      carRef.current = updateCarFromControls(carRef.current, controls, delta);
      sensorRef.current = updateSensorWithCar(carRef.current, road);
    },
    [carRef, sensorRef, updateSensorWithCar]
  );

  const drawCarInContext = useCallback(
    (ctx: CanvasRenderingContext2D, controls: Controls, road: Road, delta: number) => {
      drawCar(carRef.current, ctx);
      drawSensorInContext(ctx);
    },
    [carRef, drawSensorInContext]
  );

  return {carRef, drawCarInContext, updateCar};
};

export {useCar};
export type {Car};
