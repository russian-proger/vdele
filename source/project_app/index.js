import React from 'react';
import ReactDOM from 'react-dom';

import blue from '@material-ui/core/colors/blue';
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
      light: blue[50],
      main: blue[800],
      dark: blue[900]
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