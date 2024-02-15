import {useCars} from '@/components/hooks/useCars';
import {useRoad} from '@/components/hooks/useRoad';
import {useCallback, useEffect, useRef} from 'react';
import styled from 'styled-components';
import {createRoad} from '@/domain/model/Road';
import {drawNetwork} from '@/domain/model/NetworkVisualizer';
import {getBestCar} from '@/domain/model/Car';

const Container = styled.canvas<{color: string}>`
  background-color: ${({color}) => color};
`;
const Buttons = styled.div`
  display: flex;
  flex-direction: column;
`;

const discard = () => {
  localStorage.removeItem('bestBrain');
};

const getBestBrain = () => {
  return localStorage.getItem('bestBrain');
};

const ROAD_WIDTH = 200;
const Canvas = () => {
  const animationRequestRef = useRef<number>(0);

  const start = useRef<number>(0);
  const previousTimeStamp = useRef<number>(0);

  const roadCanvasRef = useRef<HTMLCanvasElement>(null);
  const networkCanvasRef = useRef<HTMLCanvasElement>(null);

  const {roadRef, trafficRef, drawRoadInContext, updateRoad} = useRoad(createRoad(100, ROAD_WIDTH * 0.9));
  const {carRefs, drawCars, updateCars} = useCars({carCount: 1000, road: roadRef.current});

  let bestCar = getBestCar(carRefs.current);

  const save = useCallback(() => {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.network));
  }, [bestCar]);

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
      const networkCanvas = networkCanvasRef.current;
      if (!roadCanvas || !networkCanvas) return;

      roadCanvas.height = window.innerHeight;
      roadCanvas.width = ROAD_WIDTH;

      networkCanvas.height = window.innerHeight;
      networkCanvas.width = ROAD_WIDTH * 1.5;

      const roadContext = roadCanvas.getContext('2d');
      const networkContext = networkCanvas.getContext('2d');
      if (!roadContext || !networkContext) return;

      updateRoad(delta);
      updateCars(roadRef.current, trafficRef.current, delta);

      bestCar = getBestCar(carRefs.current);

      roadContext.save();
      roadContext.translate(0, -bestCar.y + roadCanvas.height * 0.7);

      drawRoadInContext(roadContext, delta);
      drawCars(roadContext);

      networkContext.lineDashOffset = -timeStamp / 50;
      drawNetwork(networkContext, bestCar.network);

      roadContext.restore();

      animationRequestRef.current = requestAnimationFrame(animate);
    },
    [carRefs, roadRef, trafficRef, updateCars, updateRoad, drawCars, drawRoadInContext]
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

  return (
    <>
      <Container ref={roadCanvasRef} color="lightgray"></Container>
      <Container ref={networkCanvasRef} color="black"></Container>
      <Buttons>
        <button onClick={save}> 💾 Save</button>
        <button onClick={discard}> 🗑 Discard</button>
      </Buttons>
    </>
  );
};

export default Canvas;
