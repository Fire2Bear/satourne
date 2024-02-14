import {updateCarFromControls} from '@/domain/model/Car';
import {Road} from '@/domain/model/Road';
import {Traffic, createFakeControls, drawTraffic} from '@/domain/model/Traffic';
import {useRef} from 'react';

const useTraffic = (traffic: Traffic) => {
  const trafficRef = useRef(traffic);

  const updateTraffic = (roadBorders: Road['borders'], delta: number) => {
    trafficRef.current = trafficRef.current.map(car =>
      updateCarFromControls(car, createFakeControls(), roadBorders, [], delta)
    );
  };

  const drawTrafficInContext = (ctx: CanvasRenderingContext2D) => {
    drawTraffic(ctx, trafficRef.current);
  };

  return {trafficRef, drawTrafficInContext, updateTraffic};
};

export {useTraffic};
