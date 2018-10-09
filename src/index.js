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

console.info('LBAPP VERSION 0.271', [
  'Feature/1004 Expanded sections remembered #1009',
  'Bugfix/893 connecting model to model makes browser hanging #1006',
  'Bugfix/894 textarea not working in safari #1005',
  'Feature/1001 walkthrough text changes #1002',
  'Feature/998 Add CA pair to pass required params validation #1000',
  'Feature/908 reorder model properties #999',
  'Feature/905 Ellipsis icon change #997',
  'Feature/986 Walkthrough: Show editor in the model #996',
  'Feature/987 Policy drop down restrict autocomplete #995',
  'Feature/991 Remove references to LB product #994',
  'Feature/990 Swap LB logo to Express Serverless Platform #993',
  'Feature/981 Entity in lock state #992',
  'Bugfix/984 CA pairs are not updated on policy change #985',
  'Feature/946 Cannot rebundle highlighted api endpoints between apis #982',
  'Bugfix/938 Model array icon shown on canvas #979',
  'Feature/975 api endpoint inherits context path from connected function #978',
  'Feature/488 Policy input should be select, not autocomplete #977',
  'Feature/918 Code editor resize remembered #976'
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
