window.deb('MANAGE');
import {actions} from './reduxActions/actions';
import ApiEndpoint from './models/ApiEndpoint';
import ApiEndpointComponent from './components/CanvasElements/ApiEndpoint';
import reducers from './reducers';
import plugs from './plugs';

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
  },
};

window.deb('manage: ' + typeof registerPlugin);
window.deb('manage: ' + Object.keys(reducers).join(', '));
window.deb('manage: ' + Object.keys(plugs).join(', '));
window.deb('manage: ' + Object.values(plugs.tools).map(t => t.map(({name}) => name)).join(', '));

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerManage = LunchBadgerManage;
}

module.exports = LunchBadgerManage;
