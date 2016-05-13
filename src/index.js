import ComposePlugin from './plugs/ComposePlugin';

// components
import ModelComponent from './components/CanvasElements/Model';
import DataSourceComponent from './components/CanvasElements/DataSource';

// stores
import Backend from 'stores/Backend';

// models

// actions
import initializeBackend from 'actions/Stores/Backend/initialize';
import initializePrivate from 'actions/Stores/Private/initialize';

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
