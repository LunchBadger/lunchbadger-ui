import {combineReducers} from 'redux';
import appState from './appState';

const core = combineReducers({
  appState,
});

export default core;
