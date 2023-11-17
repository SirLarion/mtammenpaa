import { useEffect, useState, TouchEventHandler, useRef } from 'react';

type TTouchHandler = TouchEventHandler<HTMLDivElement>;

export const useGrab = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [y, setY] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (y === undefined && ref.current) {
      console.log(ref.current);
      setY(ref.current.clientTop);
    }
  }, [ref]);

  const onTouchStart: TTouchHandler = event => {
    const { clientY } = event.changedTouches[0];
    setY(clientY);
  };
  const onTouchMove: TTouchHandler = event => {
    const { clientY } = event.changedTouches[0];
    setY(clientY);
  };
  const onTouchEnd: TTouchHandler = event => {
    const { clientY } = event.changedTouches[0];
    setY(clientY);
  };

  return {
    ref,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
