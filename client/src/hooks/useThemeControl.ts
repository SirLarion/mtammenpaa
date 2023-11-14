import { useState } from 'react';
import { assocPath } from 'ramda';

import { theme as themeObj, TThemeName } from '../styles/theme';

const getInitialTheme = (): TThemeName | undefined => {
  const prefersLight = window.matchMedia(
    '(prefers-color-scheme: light)'
  ).matches;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (prefersLight) return 'light';
  if (prefersDark) return 'light';

  return undefined;
};

const getSecondaryBackground = (t: TThemeName) => {
  const h = Math.floor(Math.random() * 360);
  const s = 35;
  const l = t === 'light' ? 85 : 15;

  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const useThemeControl = () => {
  const [themeName, setTheme] = useState<TThemeName>(
    getInitialTheme() || 'light'
  );
  const [secondaryBg, _] = useState(getSecondaryBackground(themeName));

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return {
    isLightTheme: themeName === 'light',
    isDarkTheme: themeName === 'dark',
    theme: assocPath(
      ['background', 'secondary'],
      secondaryBg,
      themeObj[themeName]
    ),
    toggleTheme,
  };
};
