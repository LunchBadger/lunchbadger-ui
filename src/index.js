import ComposePlugin from './plugs/ComposePlugin';

// components
import App from './components/App/App';
import ModelComponent from './components/CanvasElements/Model';

// stores
import Private from 'stores/Private';

// models
import Model from 'models/Model';

// actions
import updateOrder from './actions/Quadrants/Private/updateOrder';

LunchBadgerCore.actions.registerPlugin(ComposePlugin);

// export
let LunchBadgerCompose = {
  components: {
    App: App,
    Model: ModelComponent
  },
  stores: {
    Private: Private
  },
  models: {
    Model: Model
  },
  actions: {
    Private: {
      updateOrder: updateOrder
    }
  }
};

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerCompose = LunchBadgerCompose;
}

module.exports = LunchBadgerCompose;
