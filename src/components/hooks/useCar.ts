import {Controls} from '@/components/hooks/useControl';
import {Car, drawCar, updateCarFromControls} from '@/domain/model/Car';
import {useCallback, useRef} from 'react';

const useCar = (car: Car) => {
  const carRef = useRef<Car>(car);

  const drawCarInContext = useCallback((ctx: CanvasRenderingContext2D, controls: Controls) => {
    // console.log('controls : ', controls);

    const updatedCar = updateCarFromControls(carRef.current, controls);
    drawCar(updatedCar, ctx);
    // console.log('updatedCar : ', updatedCar);

    carRef.current = updatedCar;
  }, []);

  return {drawCarInContext};
};

export {useCar};
export type {Car};
