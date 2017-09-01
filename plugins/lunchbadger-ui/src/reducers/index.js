import {combineReducers} from 'redux';
import systemNotifications from './systemNotifications';
import tooltip from './tooltip';

const ui = combineReducers({
  systemNotifications,
  tooltip,
});

export default ui;
