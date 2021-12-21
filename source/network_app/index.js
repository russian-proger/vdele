import React from 'react';
import ReactDOM from 'react-dom';

import blueGrey from '@material-ui/core/colors/blueGrey';
import grey     from '@material-ui/core/colors/grey';

import {
  createTheme,
  ThemeProvider
} from '@material-ui/core/styles';

import App from './components/App';

import('./sass/style.sass');

const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      light: blueGrey[300],
      main: blueGrey[800],
      dark: blueGrey[900]
    },
    secondary: {
      main: grey[50],
      light: grey[100],
      dark: grey[200]
    }
  },
});

function Root() {
  return (
    <ThemeProvider theme={theme}>
      <App/>
    </ThemeProvider>
  );
}

ReactDOM.render(<Root/>, document.getElementById('root'));