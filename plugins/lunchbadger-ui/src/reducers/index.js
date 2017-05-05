import {combineReducers} from 'redux';
import systemInformationMessages from './systemInformationMessages';
import systemNotifications from './systemNotifications';

const ui = combineReducers({
  systemInformationMessages,
  systemNotifications,
})

export default ui;
