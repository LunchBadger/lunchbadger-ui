import ComposePlugin from './plugs/ComposePlugin';

// components
import ModelComponent from './components/CanvasElements/Model';
import DataSourceComponent from './components/CanvasElements/DataSource';

// stores
import Backend from './stores/Backend';

// models

// actions
import initializeBackend from './actions/Stores/Backend/initialize';
import initializePrivate from './actions/Stores/Private/initialize';
import attachConnection from './actions/Connection/attach';
import reattachConnection from './actions/Connection/reattach';

LunchBadgerCore.actions.registerPlugin(ComposePlugin);

// export
let LunchBadgerCompose = {
  components: {
    Model: ModelComponent,
    DataSource: DataSourceComponent
  },
  stores: {
    Backend: Backend
  },
  actions: {
    Connection: {
      attachConnection: attachConnection,
      reattachConnection: reattachConnection
    },
    Stores: {
      Backend: {
        initialize: initializeBackend
      },
      Private: {
        initialize: initializePrivate
      }
    }
  }
};

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerCompose = LunchBadgerCompose;
}

module.exports = LunchBadgerCompose;
