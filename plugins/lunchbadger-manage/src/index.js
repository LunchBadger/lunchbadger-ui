import {actions} from './reduxActions/actions';
import ApiEndpoint from './models/ApiEndpoint';
import ApiEndpointComponent from './components/CanvasElements/ApiEndpoint';
import reducers from './reducers';
import plugs from './plugs';
import {removeServiceEndpointFromProxies} from './reduxActions/gateways';

const {registerPlugin} = LunchBadgerCore.utils;
registerPlugin(reducers, plugs);

const LunchBadgerManage = {
  models: {
    ApiEndpoint,
  },
  components: {
    ApiEndpointComponent,
  },
  utils: {
    actions,
    removeServiceEndpointFromProxies,
  },
};

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerManage = LunchBadgerManage;
}

module.exports = LunchBadgerManage;
