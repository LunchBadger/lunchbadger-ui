// entry for app...
import React from 'react';
import ReactDOM from 'react-dom';
import 'font-awesome/css/font-awesome.css';
import 'jsplumb';

const App = LunchBadgerCompose.components.App;

console.info('Application started..!');

// Render the main component into the dom
ReactDOM.render(<App />, document.getElementById('app'));
