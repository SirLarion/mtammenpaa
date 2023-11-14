export const SERVER_URL = import.meta.env.DEV
  ? import.meta.env.VITE_BACKEND_URL
  : import.meta.url;
