// import {registerPlugin} from '../../../src/reducers';
import reducers from './reducers';
import plugs from './plugs';

const {registerPlugin} = LunchBadgerCore.utils;
registerPlugin(reducers, plugs);

let LunchBadgerMonitor = {};
if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerMonitor = LunchBadgerMonitor;
}

module.exports = LunchBadgerMonitor;
