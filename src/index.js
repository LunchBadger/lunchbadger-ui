/*eslint no-console:0 */
// entry for app...
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {setGAUserId} from '../plugins/lunchbadger-ui/src';
import 'font-awesome/css/font-awesome.css';
import 'jsplumb';
import './fonts/lunchbadger.css';

console.info('LBAPP VERSION 0.333', [
  'Feature/1082 Disable function triggers on prod to model connectors and models #1086',
  'Feature/1083 Zoom level default #1085',
  'Feature/535 ApiExplorer improvements #1084',
  'Feature/328 Tooltips onclick mode #1078',
  'Feature/852 Pretty up path in validation error #1077',
  'Feature/1075 Api Explorer in panel #1076',
  'Feature/1068 resizing ports and connection lines #1074',
  'Feature/1069 Resizing: adjust widths of entities in proportion #1072',
  'Feature/1070 Resurface reinstall dependencies #1071',
  'Feature/313 Make condition grouping parameters collapsible #1065',
  'Feature/1060 New ESP logo #1063',
  'Feature/1054 Freeform GUI - shrink feature on current canvas #1062',
  'Bugfix/1057 walkthrough blocked #1058',
  'Feature/617 Add validation for model name #1052',
  'Feature/653 Tab keypress put focus on Cancel button #1051',
  'Bugfix/1048 UDF should not allow blank names #1050',
  'Feature/570 Animate swapping of entities in canvas #1047',
  'Feature/351 Suggested improvements to Settings Panel #1046',
  'Feature/1040 Show validation message for model property #1045'
]);

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

const AppLoader = LunchBadgerCore.components.AppLoader;
const storeReducers = LunchBadgerCore.utils.storeReducers;
LunchBadgerCore.multiEnvIndex = 0;

const loginManager = LunchBadgerCore.utils.createLoginManager();

loginManager.checkAuth().then(loggedIn => {
  if (!loggedIn) return;
  const {id_token, profile} = loginManager.user;
  setGAUserId(profile.sub);
  global.ID_TOKEN = id_token; // FIXME: quick and dirty fix for urgent demo
  let middleware = compose(applyMiddleware(thunk));
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    middleware = compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__());
  }
  const store = createStore(storeReducers(), middleware);
  LunchBadgerCore.services.ConfigStoreService.initialize();
  LunchBadgerCore.services.ProjectService.initialize();
  LunchBadgerCore.services.KubeWatcherService.initialize();
  LunchBadgerCore.services.SshManagerService.initialize();
  (store.getState().plugins.services || []).map(service => service.initialize());
  LunchBadgerCore.isMultiEnv = document.location.search === '?multi';

  // Render the main component into the dom
  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider muiTheme={muiTheme}>
        <AppLoader />
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('app')
  );
});
