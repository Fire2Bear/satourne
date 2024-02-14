import {Car} from '@/domain/model/Car';
import {Road} from '@/domain/model/Road';
import {Sensor, drawSensor, updateSensor} from '@/domain/model/Sensor';
import {Traffic} from '@/domain/model/Traffic';
import {useCallback, useRef} from 'react';

const useSensor = (sensor: Sensor) => {
  const sensorRef = useRef(sensor);

  const updateSensorWithCar = useCallback(
    (car: Car, traffic: Traffic, road: Road) => {
      sensorRef.current = updateSensor(car, sensorRef.current, road.borders, traffic);
      return sensorRef.current;
    },
    [sensorRef]
  );

  const drawSensorInContext = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      drawSensor(ctx, sensorRef.current);
    },
    [sensorRef]
  );

  return {sensorRef, drawSensorInContext, updateSensorWithCar};
};

export {useSensor};
