import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'typeface-roboto/index.css';

import Layout from './layout';

const theme = getMuiTheme({
  tabs: {
    backgroundColor: 'rgb(255, 255, 255)',
    textColor: 'fade(rgb(0, 0, 0), 0.7))',
    selectedTextColor: 'rgb(0, 0, 0)',
  },
});

const App = () => (
  <MuiThemeProvider muiTheme={theme}>
    <Router>
      <div>
        <Layout />
      </div>
    </Router>
  </MuiThemeProvider>
);

export default App;
