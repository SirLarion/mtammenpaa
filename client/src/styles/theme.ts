export type TThemeName = 'light' | 'dark';
export type TTheme = Record<string, Record<string, string>>;

const light: TTheme = {
  foreground: {
    primary: '#1b1b1b',
  },
  background: {
    primary: '#FBFBFA',
    secondary: '#EEEEEC',
  },
};

const dark: TTheme = {
  foreground: {
    primary: '#DDDDDF',
  },
  background: {
    primary: '#050e19',
    secondary: '#0d131c',
  },
  accent: {
    navy: '#101654',
    red: '#c00',
  },
};

export const theme: Record<TThemeName, TTheme> = { light, dark };
