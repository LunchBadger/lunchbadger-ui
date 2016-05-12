// Let's register plugins inside the Core, yay!
import ManagePlugin from './plugs/ManagePlugin';

// models
import PublicEndpoint from './models/PublicEndpoint';
import Model from './models/Model';
import ModelProperty from './models/ModelProperty';

// components
import PublicEndpointComponent from './components/CanvasElements/PublicEndpoint';
import PrivateEndpointComponent from './components/CanvasElements/PrivateEndpoint';

// actions
import updateOrderPublic from './actions/Quadrants/Public/updateOrder';
import updateOrderPrivate from './actions/Quadrants/Private/updateOrder';
import initializeGateway from './actions/Stores/Gateway/initialize';
import initializePublic from './actions/Stores/Public/initialize';
import initializePrivate from './actions/Stores/Private/initialize';

// stores
import Public from './stores/Public';
import Private from './stores/Private';
import Gateway from './stores/Gateway';

LunchBadgerCore.actions.registerPlugin(ManagePlugin);

// export
let LunchBadgerManage = {
  models: {
    PublicEndpoint: PublicEndpoint,
    Model: Model,
    ModelProperty: ModelProperty
  },
  components: {
    PublicEndpoint: PublicEndpointComponent,
    PrivateEndpoint: PrivateEndpointComponent
  },
  actions: {
    Quadrants: {
      Public: {
        updateOrder: updateOrderPublic
      },
      Private: {
        updateOrder: updateOrderPrivate
      }
    },
    Stores: {
      Gateway: {
        initialize: initializeGateway
      },
      Private: {
        initialize: initializePrivate
      },
      Public: {
        initialize: initializePublic
      }
    }
  },
  stores: {
    Public: Public,
    Gateway: Gateway,
    Private: Private
  }
};

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerManage = LunchBadgerManage;
}

module.exports = LunchBadgerManage;
