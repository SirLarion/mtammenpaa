import { useEffect, useState } from 'react';

const SCROLL_BUFFER = 3;

export const useScrollHandler = () => {
  const [isDebounced, setIsDebounced] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [scrollDir, setScrollDir] = useState<number | undefined>(undefined);

  useEffect(() => {
    const scrollHandler = () => {
      const scrollTop = window.scrollY;

      if (!isDebounced) {
        if (scrollTop > scrollPos + SCROLL_BUFFER) {
          setScrollDir(1);
        } else if (scrollTop < scrollPos - SCROLL_BUFFER) setScrollDir(-1);

        setIsDebounced(true);
        setTimeout(() => {
          setIsDebounced(false);
        }, 50);
      }

      setScrollPos(scrollTop);
    };

    window.addEventListener('scroll', scrollHandler);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [isDebounced, scrollPos, scrollDir]);

  return {
    scrollPos,
    scrollDir,
  };
};
