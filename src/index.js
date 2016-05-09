// Let's register plugins inside the Core, yay!
import ManagePlugin from './plugs/ManagePlugin';

// models
import PublicEndpoint from './models/PublicEndpoint';

// components
import PublicEndpointComponent from './components/CanvasElements/PublicEndpoint';

// actions
import updateOrder from './actions/Quadrants/Public/updateOrder';

// stores
import Public from './stores/Public';
import Gateway from './stores/Gateway';

LunchBadgerCore.actions.registerPlugin(ManagePlugin);

// export
let LunchBadgerManage = {
  models: {
    PublicEndpoint: PublicEndpoint
  },
  components: {
    PublicEndpoint: PublicEndpointComponent
  },
  actions: {
    Quadrants: {
      Public: {
        updateOrder: updateOrder
      }
    }
  },
  stores: {
    Public: Public,
    Gateway: Gateway
  }
};

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerManage = LunchBadgerManage;
}

module.exports = LunchBadgerManage;
