import {useControl} from '@/components/hooks/useControl';
import {useCar} from '@/components/hooks/useCar';
import {createCar} from '@/domain/model/Car';
import {useCallback, useEffect, useRef} from 'react';
import styled from 'styled-components';

const Container = styled.canvas`
  background-color: lightgray;
`;

const ROAD_WIDTH = 200;
const Canvas = () => {
  const animationRequestRef = useRef<number>(0);

  const roadCanvasRef = useRef<HTMLCanvasElement>(null);

  const controls = useControl();

  const {drawCarInContext} = useCar(createCar());

  const animate = useCallback(() => {
    console.log('animate');

    const roadCanvas = roadCanvasRef.current;
    if (!roadCanvas) return;

    roadCanvas.height = window.innerHeight;
    roadCanvas.width = ROAD_WIDTH;

    const roadContext = roadCanvas.getContext('2d');
    if (!roadContext) return;

    // @ts-ignore
    roadContext.clearRect(0, 0, roadCanvasRef.current?.width, roadCanvasRef.current?.height);
    drawCarInContext(roadContext, controls.current);

    animationRequestRef.current = requestAnimationFrame(animate);
  }, [controls, drawCarInContext]);

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
