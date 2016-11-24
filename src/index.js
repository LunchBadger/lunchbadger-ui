/*eslint no-console:0 */
// entry for app...
import React from 'react';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.css';
import 'jsplumb';
import './fonts/trench100free.css';
import './fonts/lunchbadger.css';
import config from 'config';

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

  // userengage.io integration
  window.civchat = {
    apiKey: 'AlZAHWKR9vzs2AFoZrg3WhtRYFNIGYPmJrxRjOaUYI1gIgvl5mf4erFfe7wBcHLZ',
    name: user.profile.preferred_username,
    email: user.profile.email,
    state: 'simple'
  };

  let configStoreService = new ConfigStoreService(config.configStoreApiUrl,
    user.id_token);

  // Render the main component into the dom
  ReactDOM.render(<AppLoader config={config}
                             loginManager={loginManager}
                             configStoreService={configStoreService} />,
                  document.getElementById('app'));
});
