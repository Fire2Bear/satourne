import {useCallback, useState} from 'react';
import {useKeyDown} from '../hooks/useKeyDown';
import {useKeyup} from '../hooks/useKeyUp';

type Props = {
  onDirectionChanged: (acceleration: number, angle: number) => void
}

const useControl = () => {

  const [left, setLeft] = useState<boolean>(false)
  const [right, setRight] = useState<boolean>(false)
  const [forward, setForward] = useState<boolean>(false)
  const [reverse, setReverse] = useState<boolean>(false)

  const handleKeyDown = useCallback(
    (key: string) => {
      switch(key){
        case "ArrowLeft":
          setLeft(true)
          break;
        case "ArrowRight":
          setRight(true)
          break;
        case "ArrowDown":
          setReverse(true)
          break;
        case "ArrowUp":
          setForward(true)
          break;
      }
    },
    [],
  )

  const handleKeyUp = useCallback(
    (key: string) => {
      switch(key){
        case "ArrowLeft":
          setLeft(false)
          break;
        case "ArrowRight":
          setRight(false)
          break;
        case "ArrowDown":
          setReverse(false)
          break;
        case "ArrowUp":
          setForward(false)
          break;
      }
    },
    [],
  )

  useKeyDown(handleKeyDown, ["ArrowLeft", "ArrowRight","ArrowDown", "ArrowUp" ])
  useKeyup(handleKeyUp, ["ArrowLeft", "ArrowRight","ArrowDown", "ArrowUp" ])


  return {left, right, forward, reverse}
}

export {useControl}
