/*eslint no-console:0 */
// entry for app...
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import 'font-awesome/css/font-awesome.css';
import 'jsplumb';
import './fonts/trench100free.css';
import './fonts/lunchbadger.css';
import config from 'config';
import reducers from './reducers';

global.LUNCHBADGER_CONFIG = config;
const AppLoader = LunchBadgerCore.components.AppLoader;
const ConfigStoreService = LunchBadgerCore.services.ConfigStoreService;

console.info('Application started..!');

let loginManager = LunchBadgerCore.utils.createLoginManager(config);

loginManager.checkAuth().then(loggedIn => {
  if (!loggedIn) {
    return;
  }

  let user = loginManager.user;

  global.ID_TOKEN = user.id_token; // FIXME: quick and dirty fix for urgent demo

  config.forecastApiUrl = config.forecastApiUrl.replace('{USER}', user.profile.sub).replace('{ENV}', config.envId);

  // userengage.io integration
  window.civchat = {
    apiKey: 'AlZAHWKR9vzs2AFoZrg3WhtRYFNIGYPmJrxRjOaUYI1gIgvl5mf4erFfe7wBcHLZ',
    name: user.profile.preferred_username,
    email: user.profile.email,
    state: 'simple'
  };

  let configStoreService = new ConfigStoreService(config.configStoreApiUrl,
    user.id_token);

  let store = createStore(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  // Render the main component into the dom
  ReactDOM.render(
    <Provider store={store}>
      <AppLoader
        config={config}
        loginManager={loginManager}
        configStoreService={configStoreService}
      />
    </Provider>,
    document.getElementById('app')
  );
});
