/*eslint no-console:0 */
// entry for app...
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import ReactGA from 'react-ga';
import Config from './config';
import thunk from 'redux-thunk';
import 'font-awesome/css/font-awesome.css';
import 'jsplumb';
import './fonts/trench100free.css';
import './fonts/lunchbadger.css';

console.info('LBAPP VERSION 0.124', [
  [
    'Feature/747 Adding node 8',
    'master Feature/655 service endpoint first path cannot be removed #743',
    'Feature/719 audit autosave model #748',
    'Bugfix/733 re-connection fix #752',
    'Feature/747 add new fn types #753',
    'Feature/744 add logs to function #756'
  ],
  [
    'master Bugfix/711 Python function with error cannot be edited #714',
    'Feature/715 Error handling #716',
    'Bugfix/598 audit autosave gateways #718',
    'Bugfix/654 Cannot delete model from zoom window #725',
    'Bugfix/658 Its possible to connect with deploying or crashed gateway #726',
    'Bugfix/657 Wrong row deleted in service and api endpoint #727',
    'Feature/640 preserve state of walkthrough after page reload #724',
    'Feature/731 walkthrough continue after connecting with pipeline #732',
    'Bugfix/733 ApiEndpoint is not auto-added, when connecting again service endpoint #738',
    'Feature/728 Add python 3.6 selector for function #739',
    'Feature/740 connection remove icon #741',
    'Feature/721 Add validations to service endpoint urls #742',
    'Feature/655 service endpoint first path cannot be removed #743'
  ],
  [
    'master Bugfix/675 Unauthorized error should logout #677',
    'Feature/676 settings tooltip fix #678',
    'Bugfix/673 Unaligned warnings in code editor #679',
    'Bugfix/62 canvas weird state fix #681',
    'Feature/650 onbeforeunload #682',
    'Bugfix/558 Functions are removed on project clear #683',
    'Feature/684 turn on access via git for staging #685',
    'Bugfix/559 Remove connections on function delete #686',
    'Bugfix/572 Select truncated value #690',
    'Bugfix/691 Walkthrough stucked on deploying function #692',
    'Feature/695 Walkthrough restart #696',
    'Bugfix/694 Support link in walkthrough #697',
    'Feature/693 Walkthrough code commands #698',
    'Feature/612 Independent quadrant scrolls #699',
    'Feature/695 Walkthrough closed settings #700',
    'Bugfix/688 Autosave for function connections #701',
    'Bugfix/687 Wrong port highlighted in function #705',
    'Feature/695 Walkthrough reset text changw #706',
    'Bugfix/702 token refresh in change-stream #707',
    'Bugfix/711 Python function with error cannot be edited #714'
  ]
]);

ReactGA.initialize(Config.get('googleAnalyticsID'), {
  debug: Config.get('googleAnalyticsDebug')
});
ReactGA.pageview(window.location.pathname + window.location.search);

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
  const { id_token, profile } = loginManager.user;
  ReactGA.set({ userId: profile.sub });
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
