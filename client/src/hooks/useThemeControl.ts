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

const generateHighContrastColor = (bg: HSL, lDelta: number) => {
  const h = bg[0];
  let s = bg[1] + 35;
  let l = bg[2] + 40 * lDelta;
  let factor = contrastHsl([h, s, l], bg);
  let i = 0;
  while (factor < 4.5 && i < 100) {
    if (i % 2 === 0) {
      l += lDelta;
    } else {
      s++;
    }
    factor = contrastHsl([h, s, l], bg);
    i++;
  }

  return [h, s, l];
};

const getGeneratedColors = (t: TThemeName) => {
  const isLight = t === 'light';
  const h = Math.floor(Math.random() * 360);
  const s = 35;
  const l = isLight ? 85 : 15;

  const hc = generateHighContrastColor([h, s, l], isLight ? -1 : 1);

  return {
    background: {
      rainbow: `hsl(${h}, ${s}%, ${l}%)`,
      mono: `hsl(${h}, ${s}%, ${isLight ? 98 : 10}%)`,
      monoStrong: `hsl(${h}, ${s}%, ${isLight ? 90 : 20}%)`,
    },
    accent: {
      rainbow: `hsl(${h}, ${hc[1]}%, ${hc[2]}%)`,
      rainbowLight: `hsl(${h}, ${s}%, ${l + (isLight ? -5 : 5)}%)`,
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
