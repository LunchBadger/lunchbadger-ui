import {combineReducers} from 'redux';
import core from '../plugins/lunchbadger-core/src/reducers';
import ui from '../plugins/lunchbadger-ui/src/reducers';

const reducers = combineReducers({
  core,
  ui
});

export default reducers;
