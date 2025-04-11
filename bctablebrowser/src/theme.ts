import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { red } from '@mui/material/colors';
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    success: {
      main: green[700],
      dark: green[900], 
      contrastText: "#fff",
    },
    error: {
      main: red[700],
      dark: red[900],
      contrastText: '#fff',
    },
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
    success: {
      main: green[700],
      dark: green[900], 
      contrastText: "#000",
    },
    error: {
      main: red[700],
      dark: red[900],
      contrastText: "#000",
    },
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