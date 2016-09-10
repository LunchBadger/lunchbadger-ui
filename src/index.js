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

console.info('Application started..!');

LunchBadgerCore.utils.checkAuth(config).then(user => {
  if (!user) {
    return;
  }
  LunchBadgerCore.utils.serverIo.loadFromServer(config, user);

  // Render the main component into the dom
  ReactDOM.render(<App config={config} user={user}/>, document.getElementById('app'));
});
