import { SMALL_SCREEN_PX } from '../constants';

export const useIsSmallScreen = () => {
  return window.screen.width <= SMALL_SCREEN_PX;
};
