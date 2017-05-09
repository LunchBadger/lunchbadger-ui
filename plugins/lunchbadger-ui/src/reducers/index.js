import {combineReducers} from 'redux';
import systemDefcon1 from './systemDefcon1';
import systemInformationMessages from './systemInformationMessages';
import systemNotifications from './systemNotifications';

const ui = combineReducers({
  systemDefcon1,
  systemInformationMessages,
  systemNotifications,
})

export default ui;
