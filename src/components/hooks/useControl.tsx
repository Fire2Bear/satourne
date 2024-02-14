import {useKeyDown} from '@/components/hooks/useKeyDown';
import {useKeyup} from '@/components/hooks/useKeyUp';
import {useCallback, useRef} from 'react';

type Props = {
  onDirectionChanged: (acceleration: number, angle: number) => void;
};

type Controls = {
  left: boolean;
  right: boolean;
  forward: boolean;
  reverse: boolean;
};
const useControl = () => {
  // const [left, setLeft] = useState<boolean>(false);
  // const [right, setRight] = useState<boolean>(false);
  // const [forward, setForward] = useState<boolean>(false);
  // const [reverse, setReverse] = useState<boolean>(false);

  const controlsRef = useRef<Controls>({left: false, right: false, forward: false, reverse: false});

  const handleKeyDown = useCallback((key: string) => {
    switch (key) {
      case 'ArrowLeft':
        controlsRef.current.left = true;
        break;
      case 'ArrowRight':
        controlsRef.current.right = true;
        break;
      case 'ArrowDown':
        controlsRef.current.reverse = true;
        break;
      case 'ArrowUp':
        controlsRef.current.forward = true;
        break;
    }
  }, []);

  const handleKeyUp = useCallback((key: string) => {
    switch (key) {
      case 'ArrowLeft':
        controlsRef.current.left = false;
        break;
      case 'ArrowRight':
        controlsRef.current.right = false;
        break;
      case 'ArrowDown':
        controlsRef.current.reverse = false;
        break;
      case 'ArrowUp':
        controlsRef.current.forward = false;
        break;
    }
  }, []);

  useKeyDown(handleKeyDown, ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp']);
  useKeyup(handleKeyUp, ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp']);

  return {controlsRef};
};

export {useControl};
export type {Controls};
