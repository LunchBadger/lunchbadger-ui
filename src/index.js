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
import './fonts/trench100free.css';
import './fonts/lunchbadger.css';

console.info('LBAPP VERSION 0.232', [
  [
    'master Feature/846 real time field change #867',
    'Feature/869 On function deploy failure constrain error within entity #871',
    'Feature/823 Service endpoints in EG only when connected #873',
    'Feature/884 extend model service endpoint url #885',
    'Bugfix/888 Code editor on models cannot resize horizontally, only vertically #889',
    'Bugfix/890 sls PUT sends undefined instead of name #891',
    'Feature/872 app in disabled state when workspace not running #892',
    'Bugfix/886 Unblock walkthrough after gateway deployed #897',
    'Bugfix/840 Mask overlay not covering connections #898',
    'Bugfix/870 Adding new policy doesnt auto-scroll down to new record #899',
    'Feature/903 Handle Function deploy failure #912',
    'Feature/902 rest connector in crud mode #914',
    'Feature/903 removed await deploy #923',
    'Feature/879 add GTM #924',
    'Feature/837 GAevent: completed the walkthrough #926',
    'Feature/877 conversion goal exclude walkthrough #927',
    'Feature/903 icon repositioned #929',
    'Feature/445 on 422 error repeat call max 5 times #928',
    'Bugifx/922 update schema #930',
    'Feature/878 create ability to redeploy function #932',
    'Feature/777 silent reload #933',
    'Feature/936 Improve onerror for change stream event #937',
    'Feature/935 handle better entity delete error call #943',
    'Feature/777 silent reload #933',
    'Bugfix/946 reconnecting api endpoint between pipelines #948',
    'Feature/906 Rename data source to model connector #949',
    'Feature/907 Model connector renaming in walkthrough #950',
    'Feature/904 walkthrough: quick edit vs full edit #951',
    'Feature/940 IE warning #952',
    'Feature/887 re-enable manta connector on staging #953',
    'Feature/853 Visualize empty object in policy parameters #954'
  ],
  [
    'master Bugfix/835 need to suppress messages for non visible entities #839',
    'Feature/819 add validations in policies for required parameters #843',
    'Feature/842 adding a policy adds default ca pair with required fields #844',
    'Feature/842 adding a policy adds default ca pair fixes #850',
    'Feature/845 visualize implicite ca pair #851',
    'Bugfix/834 Sometimes proxy policy is missing #857',
    'Bugfix/854 walkthrough: copy clipboard for api endpoints needs fixes #858',
    'Feature/846 always render all ca properties #859',
    'Feature/841 ApiEndpoints only connected with one pipeline #860',
    'Feature/847 remove auto adding ca pair #862',
    'Feature/863 Do not display error on function delete failure #864',
    'Feature/834 gateway deployments resistant for kw anomalies #865',
    'Feature/861 add prev and current revision (instance) to debugger console #866',
    'Feature/846 real time field change #867',
    'Feature/869 On function deploy failure constrain error within entity #871'
  ]
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
