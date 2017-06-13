import {combineReducers} from 'redux';
import systemDefcon1 from './systemDefcon1';
import systemInformationMessages from './systemInformationMessages';
import systemNotifications from './systemNotifications';
import multiEnvironments from './multiEnvironments';
import tooltip from './tooltip';

const ui = combineReducers({
  systemDefcon1,
  systemInformationMessages,
  systemNotifications,
  multiEnvironments,
  tooltip,
});

export default ui;
