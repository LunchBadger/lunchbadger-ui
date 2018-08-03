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

console.info('LBAPP VERSION 0.145', [
  [
    'master Feature/722 admin api calls parallel with project api calls #765',
    'Feature/599 autosave apis #768',
    'Feature/600 autosave portals #769',
    'Feature/595 autosave microservices #770',
    'Bugfix/766 cannot add new connected pipelines via zoom window #776',
    'Bugfix/773 Model and Function should only allow connection to correct pipelines #779',
    'Feature/775 Add copy to clipboard icons in walkthrough #780',
    'Bugfix/771 bundled entities #783',
    'Feature/774 Redundant saved message #784',
    'Bugfix/786 Basic auth / oauth2 custom password #787',
    'Feature/785 Reorder policies icon #789',
    'Feature/757 function logs resizable #791',
    'Feature/730 Gateway deployment interrupted with page reload #793',
    'Feature/758 auto refresh in function logs #794',
    'Feature/790 APIs highlighted in portal #795',
    'Feature/796 Default handlers selected in function code #797'
  ],
  [
    'master Feature/399 fn types per environment #763',
    'Feature/722 admin api calls parallel with project api calls #765'
  ],
  [
    'Feature/747 Adding node 8',
    'master Feature/655 service endpoint first path cannot be removed #743',
    'Feature/719 audit autosave model #748',
    'Bugfix/733 re-connection fix #752',
    'Feature/747 add new fn types #753',
    'Feature/744 add logs to function #756',
    'Bugfix/754 Connections ports alignment #759',
    'Bugfix/761 cannot save model #762'
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
