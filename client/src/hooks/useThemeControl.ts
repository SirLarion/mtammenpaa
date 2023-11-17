import { useState } from 'react';
import { mergeDeepRight } from 'ramda';
import convert from 'color-convert';
import contrast from 'color-contrast';

import { theme as themeObj, TThemeName } from '../styles/theme';

const getInitialTheme = (): TThemeName | undefined => {
  const prefersLight = window.matchMedia(
    '(prefers-color-scheme: light)'
  ).matches;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (prefersLight) return 'light';
  if (prefersDark) return 'dark';

  return undefined;
};

type HSL = [number, number, number];

const contrastHsl = (hsl1: HSL, hsl2: HSL) =>
  contrast(convert.hsl.hex(hsl1), convert.hsl.hex(hsl2));

const generateHighContrastColor = (bg: HSL) => {
  const h = bg[0];
  let s = bg[1] + 35;
  let l = bg[2] - 40;
  let factor = contrastHsl([h, s, l], bg);
  let i = 0;
  while (factor < 4.5 && i < 100) {
    if (i % 2 === 0) {
      l--;
    } else {
      s++;
    }
    factor = contrastHsl([h, s, l], bg);
    i++;
  }
  console.log(factor);

  return [h, s, l];
};

const getGeneratedColors = (t: TThemeName) => {
  const h = Math.floor(Math.random() * 360);
  const s = 35;
  const isLight = t === 'light';
  const l = isLight ? 85 : 15;

  const dark = generateHighContrastColor([h, s, l]);

  return {
    background: {
      rainbow: `hsl(${h}, ${s}%, ${l}%)`,
    },
    accent: {
      rainbow: `hsl(${h}, ${dark[1]}%, ${isLight ? dark[2] : l + 30}%)`,
      rainbowLight: `hsl(${h}, ${s}%, ${isLight ? l - 5 : l + 5}%)`,
    },
  };
};

export const useThemeControl = () => {
  const [themeName, setTheme] = useState<TThemeName>(
    getInitialTheme() || 'light'
  );

  const [generatedColors, _] = useState(getGeneratedColors(themeName));

  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return {
    isLightTheme: themeName === 'light',
    isDarkTheme: themeName === 'dark',
    theme: mergeDeepRight(themeObj[themeName], generatedColors),
    toggleTheme,
  };
};
