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
import {GA} from '../plugins/lunchbadger-ui/src';
import 'font-awesome/css/font-awesome.css';
import 'jsplumb';
import './fonts/trench100free.css';
import './fonts/lunchbadger.css';

console.info('LBAPP VERSION 0.179', [
  [
    'master Bugfix/835 need to suppress messages for non visible entities #839',
    'Feature/819 add validations in policies for required parameters #843',
    'Feature/842 adding a policy adds default ca pair with required fields #844',
    'Feature/842 adding a policy adds default ca pair fixes #850',
    'Feature/845 visualize implicite ca pair #851',
    'Bugfix/834 Sometimes proxy policy is missing #857',
    'Bugfix/854 walkthrough: copy clipboard for api endpoints needs fixes #858',
    'Feature/846 always render all ca properties #859',
    'Feature/841 ApiEndpoints only connected with one pipeline #860'
  ],
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
    'Feature/796 Default handlers selected in function code #797',
    'Feature/798 walkthrough remove api from model endpoint #800',
    'Feature/802 walkthrough: remove /api for function on API endpoint #803',
    'Bugfix/801 remove clipboard icon from walkthrough #804',
    'Feature/10 Walkthrough: tell user to wait till deployed #805',
    'Feature/806 Dangling api endpoints in EG #807',
    'Feature/788 Password strength meter for basic-auth and oauth2 #811',
    'Feature/808 utilize new pod id for ui entity state comparision for gateways #812',
    'Feature/809 Utilize new pod id for UI entity state comparision for functions #813',
    'Feature/810 delete gateway and function entities right away but allow name to be reused immediately #814',
    'Feature/781 Add runtime in collapsed functions #815',
    'Feature/817 Sync UI with EG schemas #818',
    'Feature/822 add entity id to zoom window #824',
    'Feature/767 Add apiEndpoint unique name validations vs apis and portals #826',
    'Feature/825 add possibility in schemas to set policy parameter label #827',
    'Feature/828 Add url parameter for displaying GA logs #829',
    'Feature/821 front end analytics events #830',
    'Feature/832 Adding stripPath: true by default when a Model connects to a Pipeline. #833',
    'Bugfix/835 need to suppress messages for non visible entities #839'
  ],
  [
    'master Feature/399 fn types per environment #763',
    'Feature/722 admin api calls parallel with project api calls #765'
  ]
]);

GA.pageview(window.location.pathname + window.location.search);

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
  GA.set({userId: profile.sub});
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
