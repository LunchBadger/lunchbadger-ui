/*eslint no-console:0 */
// entry for app...
import React from 'react';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.css';
import 'jsplumb';
import './fonts/trench100free.css';
import './fonts/lunchbadger.css';

const App = LunchBadgerCore.components.App;

console.info('Application started..!');

require('./propagateData');

// Render the main component into the dom
ReactDOM.render(<App />, document.getElementById('app'));
