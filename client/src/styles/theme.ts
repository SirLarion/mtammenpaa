type TTheme = Record<string, Record<string, string>>;

const light: TTheme = {
  foreground: {
    primary: "#101010",
  },
  background: {
    primary: "#FFFFF0",
  },
};

const dark: TTheme = {
  foreground: {
    primary: "#DDDDDF",
  },
  background: {
    primary: "#050e19",
    secondary: "#0d131c",
    tertiary: "#080c11",
  },
  accent: {
    navy: "#101654",
    red: "#c00",
  },
};

export const theme = { light, dark };
