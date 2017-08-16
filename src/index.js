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
import './fonts/trench100free.css';
import './fonts/lunchbadger.css';
import reducers from './reducers';

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
LunchBadgerCore.multiEnvIndex = 0;

console.info('Application started..!');

const loginManager = LunchBadgerCore.utils.createLoginManager();

loginManager.checkAuth().then(loggedIn => {
  if (!loggedIn) {
    return;
  }

  const {id_token, profile: {email, preferred_username: name}} = loginManager.user;

  global.ID_TOKEN = id_token; // FIXME: quick and dirty fix for urgent demo

  // userengage.io integration
  window.civchat = {
    apiKey: 'AlZAHWKR9vzs2AFoZrg3WhtRYFNIGYPmJrxRjOaUYI1gIgvl5mf4erFfe7wBcHLZ',
    name,
    email,
    state: 'simple'
  };

  let middleware = compose(applyMiddleware(thunk));
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    middleware = compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__());
  }
  const store = createStore(reducers(), middleware);

  LunchBadgerCore.services.ConfigStoreService.initialize();
  LunchBadgerCore.services.ProjectService.initialize();
  (store.getState().plugins.services || []).map(service => service.initialize());

  LunchBadgerCore.isMultiEnv = document.location.search === '?multi';
  LunchBadgerCore.isDataSourceFeature = document.location.search === '?ds';

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
