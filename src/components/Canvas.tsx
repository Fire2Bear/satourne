import {useCar} from '@/components/hooks/useCar';
import {useRoad} from '@/components/hooks/useRoad';
import {createCar} from '@/domain/model/Car';
import {useCallback, useEffect, useRef} from 'react';
import styled from 'styled-components';
import {createRoad, getLaneCenter} from '@/domain/model/Road';
import {drawNetwork} from '@/domain/model/NetworkVisualizer';

const Container = styled.canvas<{color: string}>`
  background-color: ${({color}) => color};
`;

const ROAD_WIDTH = 200;
const Canvas = () => {
  const animationRequestRef = useRef<number>(0);

  const start = useRef<number>(0);
  const previousTimeStamp = useRef<number>(0);

  const roadCanvasRef = useRef<HTMLCanvasElement>(null);
  const networkCanvasRef = useRef<HTMLCanvasElement>(null);

  const {roadRef, trafficRef, drawRoadInContext, updateRoad} = useRoad(createRoad(100, ROAD_WIDTH * 0.9));
  const {carRef, networkRef, drawCarInContext, updateCar} = useCar(createCar({x: getLaneCenter(1, roadRef.current)}));

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
      updateCar(roadRef.current, trafficRef.current, delta);

      roadContext.clearRect(0, 0, roadCanvas.width, roadCanvas.height);
      roadContext.save();
      roadContext.translate(0, -carRef.current.y + roadCanvas.height * 0.7);

      drawRoadInContext(roadContext, delta);
      drawCarInContext(roadContext);

      networkContext.lineDashOffset = -timeStamp / 50;
      drawNetwork(networkContext, networkRef.current);

      roadContext.restore();

      animationRequestRef.current = requestAnimationFrame(animate);
    },
    [carRef, roadRef, trafficRef, networkRef, updateCar, updateRoad, drawCarInContext, drawRoadInContext]
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
    </>
  );
};

export default Canvas;
