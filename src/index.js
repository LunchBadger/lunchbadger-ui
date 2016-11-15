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
const App = LunchBadgerCore.components.App;
const ProjectService = LunchBadgerCore.services.ProjectService;

console.info('Application started..!');

let loginManager = LunchBadgerCore.utils.createLoginManager(config);

loginManager.checkAuth().then(loggedIn => {
  if (!loggedIn) {
    return;
  }

  // userengage.io integration
  window.civchat = {
    apiKey: 'AlZAHWKR9vzs2AFoZrg3WhtRYFNIGYPmJrxRjOaUYI1gIgvl5mf4erFfe7wBcHLZ',
    name: loginManager.user.profile.preferred_username,
    email: loginManager.user.profile.email,
    state: 'simple'
  };

  let projectService = new ProjectService(config.projectApiUrl,
    config.workspaceApiUrl, loginManager.user.id_token);

  // Render the main component into the dom
  ReactDOM.render(<App config={config}
                       loginManager={loginManager}
                       projectService={projectService} />,
                  document.getElementById('app'));
});
