import { useState } from 'react';

export const useTap = () => {
  const [tapped, setTapped] = useState(false);
  const handleTap = () => {
    setTapped(true);
    setTimeout(() => {
      setTapped(false);
    }, 200);
  };

  return {
    tapped,
    tapHandler: handleTap,
  };
};
