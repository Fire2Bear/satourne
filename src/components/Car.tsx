import {useEffect, useRef, useState} from 'react';
import {useControl} from './Control';

type Props = {
  car: CarProperties;
  ctx: CanvasRenderingContext2D;
  updateCarProperties : (properties:CarProperties) => void
}

type CarProperties = {
  speed: number;
  x: number;
  y: number;
  angle: number
  width: number;
  height: number;
}

const MAX_SPEED = 3
const FRICTION = 0.5
const Car = ({ctx, car: originalCar, updateCarProperties}: Props) => {
    const {left, right, forward, reverse} = useControl()
    const [car, setCar]  = useState<CarProperties>({...originalCar})
    const requestRef = useRef<number>();



    const updatePosition = () => {
      let {x, y, angle, speed} = {...car}
      const acceleration = forward ? 1 : reverse ? -1 : 0
      speed = car.speed + acceleration;
      if(speed > MAX_SPEED) speed = MAX_SPEED
      if(speed < -MAX_SPEED/2) speed = -MAX_SPEED/2

      if(speed > 0) speed -= FRICTION
      if(speed < 0) speed += FRICTION

      if(speed !== 0) {
        const flip = speed > 0 ? 1: -1
        const angleModif = right ? -0.03 : left ? 0.03 : 0
        angle += angleModif * flip;
      }

      if(Math.abs(speed) < FRICTION) speed = 0

      const newProperties = {...car,
        speed,
        angle,
        x: x - Math.sin(angle)*speed,
        y: y - Math.cos(angle)*speed
      }

      setCar(newProperties)
      updateCarProperties(newProperties)
      // requestAnimationFrame(updatePosition)

    }

    useEffect(() => {

      requestRef.current = requestAnimationFrame(updatePosition)

      return () => cancelAnimationFrame(requestRef.current!)
    })



  return <>


  </>
}


export {Car}
export type {CarProperties}
