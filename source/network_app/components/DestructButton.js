import React from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import red from '@material-ui/core/colors/red';

const red_theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      light: red[50],
      main: red[500],
      dark: red[700],
      contrastText: '#ffffff',
    },
  }
});

export default function SuccessButton(props) {
  return (
    <ThemeProvider theme={red_theme}>
      <Button variant="contained" color="primary" {...props}>{props.children}</Button>
    </ThemeProvider>
  )
}