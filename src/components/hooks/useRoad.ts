import {useTraffic} from '@/components/hooks/useTraffic';
import {Road, drawRoad} from '@/domain/model/Road';
import {createTraffic} from '@/domain/model/Traffic';
import {useRef} from 'react';

type Props = {
  x?: number;
  laneCount?: number;
  width?: number;
};

const useRoad = (road: Road) => {
  const roadRef = useRef<Road>(road);

  const {trafficRef, drawTrafficInContext, updateTraffic} = useTraffic(createTraffic(roadRef.current, 1));

  const updateRoad = (delta: number) => {
    updateTraffic(roadRef.current.borders, delta);
  };

  const drawRoadInContext = (ctx: CanvasRenderingContext2D, delta: number) => {
    drawRoad(ctx, road, delta);
    drawTrafficInContext(ctx);
  };

  return {roadRef, trafficRef, drawRoadInContext, updateRoad};
};

export {useRoad};
