import {useControl} from '@/components/hooks/useControl';
import {useNetwork} from '@/components/hooks/useNetwork';
import {useSensor} from '@/components/hooks/useSensor';
import {Car, convertOutputsToControls, drawCar, updateCarFromControls} from '@/domain/model/Car';
import {createNetwork} from '@/domain/model/Network';
import {Road} from '@/domain/model/Road';
import {createSensor} from '@/domain/model/Sensor';
import {Traffic} from '@/domain/model/Traffic';
import {useCallback, useRef} from 'react';

const useCar = (car: Car) => {
  const {sensorRef, drawSensorInContext, updateSensorWithCar} = useSensor(createSensor({}));
  const carRef = useRef<Car>(car);

  const {controlsRef} = useControl();
  const {networkRef, updateNetwork} = useNetwork(createNetwork([sensorRef.current.rayCount, 6, 4]));

  const brainRef = useRef(true);

  const updateCar = useCallback(
    (road: Road, traffic: Traffic, delta: number) => {
      const {left, right, forward, reverse} = controlsRef.current;

      if (left || right || forward || reverse) {
        brainRef.current = false;
      } else {
        brainRef.current = true;
      }

      sensorRef.current = updateSensorWithCar(carRef.current, traffic, road);
      const offsets = sensorRef.current.readings.map(reading => (reading === null ? 0 : 1 - reading.offset));

      const outputs = updateNetwork(offsets);
      const brainControls = convertOutputsToControls(outputs);

      carRef.current = updateCarFromControls(
        carRef.current,
        brainRef.current ? brainControls : controlsRef.current,
        road.borders,
        traffic,
        delta
      );
    },
    [carRef, sensorRef, controlsRef, brainRef, updateSensorWithCar, updateNetwork]
  );

  const drawCarInContext = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      drawCar(carRef.current, ctx, 'blue');
      drawSensorInContext(ctx);
    },
    [carRef, drawSensorInContext]
  );

  return {carRef, drawCarInContext, updateCar};
};

export {useCar};
export type {Car};
