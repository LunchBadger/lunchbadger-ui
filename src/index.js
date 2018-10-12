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

console.info('LBAPP VERSION 0.282', [
  'Feature/983 ApiEndpoint should inherit context path part 2 #1017',
  'Feature/980 ContextPath logic as in loopback #1016',
  'Feature/909 Function to model connection as dashed line #1015',
  'Feature/921 JWT secretOrPublicKey should be textarea #1014',
  'Feature/1007 Deprecate implicite ca pairs #1013',
  'Bugfix/1008 Quadrants headers issue on safari #1012',
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
  'Feature/990 Swap LB logo to Express Serverless Platform #993'
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
