import React from 'react';
import ReactDOM from 'react-dom';

import blue from '@material-ui/core/colors/blue';
import red     from '@material-ui/core/colors/red';

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
      light: blue[50],
      main: blue[800],
      dark: blue[900]
    },
    secondary: {
      main: red[800],
      light: red[50],
      dark: red[900]
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