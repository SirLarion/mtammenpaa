export type TThemeName = 'light' | 'dark';
export type TTheme = Record<string, Record<string, string>>;

export const TINY = '0.25rem';
export const SMALL = '0.5rem';
export const REGULAR = '1rem';
export const LARGE = '1.5rem';
export const HUGE = '2rem';

const light: TTheme = {
  foreground: {
    primary: '#1d1d1d',
  },
};

const dark: TTheme = {
  foreground: {
    primary: '#f6f6f6',
  },
};

export const theme: Record<TThemeName, TTheme> = { light, dark };
