import React from 'react';
import {configure, addDecorator, setAddon} from '@kadira/storybook';
import infoAddon from '@kadira/react-storybook-addon-info';
import {setOptions} from '@kadira/storybook-addon-options';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

setOptions({
  name: 'LunchBadger',
  url: 'https://app.lunchbadger.com',
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: true,
  showSearchBox: false,
  downPanelInRight: true,
  sortStoriesByKind: false,
});

setAddon(infoAddon);

addDecorator((story) => (
  <div className="story">
    {story()}
  </div>
));

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  fontFamily: 'Open Sans',
  palette: {
    primary1Color: '#4190cd',
    accent1Color: '#047C99'
  }
});

addDecorator((story) => (
  <MuiThemeProvider muiTheme={muiTheme}>
    {story()}
  </MuiThemeProvider>
));

function loadStories() {
  require('../storybook/index.js');
}

configure(loadStories, module);
