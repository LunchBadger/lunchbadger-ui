import {actions} from './reduxActions/actions';
import ApiEndpoint from './models/ApiEndpoint';

// import {registerPlugin} from '../../../src/reducers';
import reducers from './reducers';
import plugs from './plugs';

const {registerPlugin} = LunchBadgerCore.utils;
registerPlugin(reducers, plugs);

const LunchBadgerManage = {
  models: {
    ApiEndpoint,
  },
  utils: {
    actions,
  },
};

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerManage = LunchBadgerManage;
}

module.exports = LunchBadgerManage;
