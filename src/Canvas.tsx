
import {useRef, useState, useEffect} from 'react';
import styled from 'styled-components';
import {Car, CarProperties} from './components/Car';

const Container = styled.canvas`
    background: lightgray;
`

const CAR_WIDTH = 30
const CAR_HEIGHT = 50
const Canvas = () => {

  const ref = useRef<HTMLCanvasElement>(null)

  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>()

  const [car, setCar] = useState<CarProperties>({x: 100, y: 100, speed: 0, height: CAR_HEIGHT, width: CAR_WIDTH, angle: 0})


  const requestRef = useRef<number>();

  const animate = () => {

    if(ref.current) {
      const ctx = ref.current.getContext('2d')
      setContext(ctx)
    }

    if(ctx){
      // @ts-ignore
      ctx.clearRect(0, 0, ref.current?.width, ref.current?.height);
      drawCar(ctx, car)

    }

    if(ref.current){
      // ref.current.height = window.innerHeight
    }
    requestAnimationFrame(animate)
  }

  requestRef.current = requestAnimationFrame(animate);
  useEffect(() => {

    return () => cancelAnimationFrame(requestRef.current!);
  }, []); // Make sure the effect runs only once







  return (

      <Container ref={ref} height={window.innerHeight} width={200}>
        {ctx && <Car car={car} ctx={ctx} updateCarProperties={setCar}/>}
      </Container>
  );
}

const drawCar = (ctx: CanvasRenderingContext2D, {x, y, speed, angle, height, width}: CarProperties) => {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(-angle)

  ctx.beginPath();
  ctx.rect(
    -width/2,
    -height/2,
    CAR_WIDTH,
    CAR_HEIGHT
    );
  ctx.fill()

  ctx.restore()
}

export default Canvas;
