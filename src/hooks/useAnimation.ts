import {RefObject, useEffect, useRef, useState} from 'react';


type Props= {
  carPosition: any
  canvasRef: RefObject<HTMLCanvasElement>
}



const CAR_WIDTH = 30
const CAR_HEIGHT = 50
const useAnimationFrame = ({ carPosition, canvasRef} : Props) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef<number>();


  const [ctx, setContext] = useState<CanvasRenderingContext2D | null>()

  useEffect(() => {
    if(canvasRef.current) {
      const currCtx = canvasRef.current.getContext('2d')
      setContext(currCtx)
      console.log("SetContext", ctx);

      const animate = () => {

        if(currCtx){

          currCtx.beginPath();
          currCtx.rect(
            carPosition.x-CAR_WIDTH/2,
            carPosition.y-CAR_HEIGHT/2,
            CAR_WIDTH,
            CAR_HEIGHT
            );

          currCtx.fill()
        } else {
          console.log("ERRRRROOOOOOOOOOOOR");

        }

        if(canvasRef.current){
          canvasRef.current.height = window.innerHeight
        }
        requestRef.current = requestAnimationFrame(animate);
      }

      requestRef.current = requestAnimationFrame(animate);

    }
      // do something here with the canvas

  }, [])


  useEffect(() => {
    return () => cancelAnimationFrame(requestRef.current!);
  }, []); // Make sure the effect runs only once
}


export {useAnimationFrame}
