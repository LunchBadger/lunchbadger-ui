/*eslint no-console:0 */
// entry for app...
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import ReactGA from 'react-ga';
import Config from './config';
import thunk from 'redux-thunk';
import 'font-awesome/css/font-awesome.css';
import 'jsplumb';
import './fonts/trench100free.css';
import './fonts/lunchbadger.css';

console.info('LBAPP VERSION 0.98', [
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
    'Feature/695 Walkthrough reset text changw #706'
  ],
  [
    'master Feature/663 Add tooltips to header menu #671',
    'Bugfix/664 Allow editing invalid functions #672',
    'Bugfix/369 Re-labeling database in redis and mongodb #674'
  ],
  [
    'master Hide reinit, restart, resintall button and change walkthrough #670',
    'Feature/663 Add tooltips to header menu #671'
  ],
  [
    'master Bugfix/56 Baking workspace infinite loop #649',
    'Feature/651 Make git access premium feature #668',
    'Bugfix/604 OK needs to be enabled for change in editor #669'
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
  const {id_token, profile} = loginManager.user;
  ReactGA.set({userId: profile.sub});
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
