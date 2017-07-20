import {combineReducers} from 'redux';
import appState from './appState';
import loadingProject from './loadingProject';

const core = combineReducers({
  appState,
  loadingProject,
});

export default core;
