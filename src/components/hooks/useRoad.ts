import {Road, drawRoad} from '@/domain/model/Road';
import {useRef} from 'react';

type Props = {
  x?: number;
  laneCount?: number;
  width?: number;
};

const useRoad = (road: Road) => {
  const roadRef = useRef<Road>(road);

  const drawRoadInContext = (ctx: CanvasRenderingContext2D, delta: number) => {
    drawRoad(ctx, road, delta);
  };

  return {roadRef, drawRoadInContext};
};

export {useRoad};
