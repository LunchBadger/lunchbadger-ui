import {combineReducers} from 'redux';
import systemNotifications from './systemNotifications';

const ui = combineReducers({
  systemNotifications,
});

export default ui;
