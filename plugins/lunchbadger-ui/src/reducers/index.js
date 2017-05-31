import {combineReducers} from 'redux';
import systemDefcon1 from './systemDefcon1';
import systemInformationMessages from './systemInformationMessages';
import systemNotifications from './systemNotifications';
import multiEnvironments from './multiEnvironments';

const ui = combineReducers({
  systemDefcon1,
  systemInformationMessages,
  systemNotifications,
  multiEnvironments,
})

export default ui;
