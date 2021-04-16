import { useRef, useEffect } from 'react';

export function useInterval(callback, delay, stopFlag) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        if (stopFlag)
            clearInterval(id);
        return () => clearInterval(id);
      }
    }, [delay, stopFlag]);
  }