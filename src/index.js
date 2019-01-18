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
import 'font-awesome/css/font-awesome.css';
import 'jsplumb';
import './fonts/lunchbadger.css';

console.info('LBAPP VERSION 0.377', [
  'Feature/1152 add loopback connector storage #1153',
  'Feature/1150 Use new xhr lib for all api calls #1151',
  'Feature/1148 Use different lib for producers api call #1149',
  'Bugfix/1146 Reload button not working in producers error box #1147',
  'Feature/1081 walkthrough with api explorer #1145',
  'Feature/1141 expose api explorer on prod #1144',
  'Feature/563 Multiselect cut off #1140',
  'Feature/353 Username must be lowercase #1139',
  'Feature/429 Inline code editor improvements #1138',
  'Feature/1114 Buttons in consumer management #1137',
  'Feature/352 js files size #1136',
  'Feature/1118 ApiExplorer preserved state #1126',
  'Feature/1117 consumer management waiting screen for credential #1125',
  'Feature/1122 make logo toggable #1124',
  'Feature/1112 soap and rest icons #1123',
  'Feature/920 add remote methods for gui to expose #1120',
  'Bugfix/1109 Admin api fails because of -- in url #1111',
  'Feature/1108 New walkthrough step after memory submit #1110',
  'Bugfix/1104 Deleted gateway should not affect new gateway name #1107',
  'Feature/1102 connectors need to use their own icon #1106'
]);

// Google Analityca
class Tracker {
  set = str => this.tracker = str;
  fn = action => `${this.tracker}.${action}`;
}
const {ga} = window;
const tracker = new Tracker();
if (ga) {
  ga(() => tracker.set(window.ga.getAll()[0].a.data.values[':name']));
}
const setGAUserId = userId => ga && ga(tracker.fn('set'), {userId});

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
