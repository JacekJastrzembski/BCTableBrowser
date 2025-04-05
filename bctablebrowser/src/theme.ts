import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
        main: '#26547a',
        dark: '#0288d1',
    },
    secondary: {
        main: '#0288d1',
        light: '#3c7fb6',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#252b30',
        paper: '#252b30',
    },
    primary: {
      main: '#2f648f',
    },
    secondary: {
        main: '#0288d1',
        light: '#92badb',
    },

  },
});