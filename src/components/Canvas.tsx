import {useControl} from '@/components/hooks/useControl';
import {useCar} from '@/components/hooks/useCar';
import {useRoad} from '@/components/hooks/useRoad';
import {createCar} from '@/domain/model/Car';
import {useCallback, useEffect, useRef} from 'react';
import styled from 'styled-components';
import {createRoad, getLaneCenter} from '@/domain/model/Road';

const Container = styled.canvas`
  background-color: lightgray;
`;

const ROAD_WIDTH = 200;
const Canvas = () => {
  const animationRequestRef = useRef<number>(0);

  const start = useRef<number>(0);
  const previousTimeStamp = useRef<number>(0);

  const roadCanvasRef = useRef<HTMLCanvasElement>(null);

  const controlsRef = useControl();

  const {roadRef, drawRoadInContext} = useRoad(createRoad(100, ROAD_WIDTH * 0.9));
  const {carRef, drawCarInContext, updateCar} = useCar(createCar({x: getLaneCenter(1, roadRef.current)}));

  const animate = useCallback(
    (timeStamp: number) => {
      if (start.current === 0) {
        start.current = timeStamp;
        previousTimeStamp.current = timeStamp;
      } else if (previousTimeStamp.current === timeStamp) {
        return;
      }

      const delta = timeStamp - previousTimeStamp.current;
      previousTimeStamp.current = timeStamp;

      const roadCanvas = roadCanvasRef.current;
      if (!roadCanvas) return;

      roadCanvas.height = window.innerHeight;
      roadCanvas.width = ROAD_WIDTH;

      const roadContext = roadCanvas.getContext('2d');
      if (!roadContext) return;

      updateCar(controlsRef.current, roadRef.current, delta);

      roadContext.clearRect(0, 0, roadCanvas.width, roadCanvas.height);
      roadContext.save();
      roadContext.translate(0, -carRef.current.y + roadCanvas.height * 0.7);

      drawRoadInContext(roadContext, delta);
      drawCarInContext(roadContext, controlsRef.current, roadRef.current, delta);

      roadContext.restore();

      animationRequestRef.current = requestAnimationFrame(animate);
    },
    [carRef, roadRef, controlsRef, updateCar, drawCarInContext, drawRoadInContext]
  );

  // useEffect(() => {
  //   console.log('blaaaaaaaaaa');
  // }, [controls, drawCarInContext]);
  // useEffect(() => {
  //   console.log('animateuuuux');
  // }, [animate]);
  // console.log('blaaaaaaaaaa23');
  useEffect(() => {
    animationRequestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRequestRef.current);
  }, [animate]);

  return <Container ref={roadCanvasRef}></Container>;
};

export default Canvas;
