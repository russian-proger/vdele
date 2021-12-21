import React from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';

const green_theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      light: green[50],
      main: green[500],
      dark: green[700],
      contrastText: '#ffffff',
    },
  }
});

export default function SuccessButton(props) {
  return (
    <ThemeProvider theme={green_theme}>
      <Button variant="contained" color="primary" {...props}>{props.children}</Button>
    </ThemeProvider>
  )
}