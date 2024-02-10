import {useCallback, useEffect} from 'react';
export const useKeyup = (callback: (key: string) => void, keys: string[]) => {
  const onKeyup = useCallback((event: any) => {
    const wasAnyKeyPressed = keys.some((key) => event.key === key);
    if (wasAnyKeyPressed) {
      event.preventDefault();
      callback(event.key);
    }
  }, [keys]);
  useEffect(() => {
    document.addEventListener('keyup', onKeyup);
    return () => {
      document.removeEventListener('keyup', onKeyup);
    };
  }, [onKeyup]);
};
