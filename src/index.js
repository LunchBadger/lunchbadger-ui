import ComposePlugin from './plugs/ComposePlugin';

// components
import ModelComponent from './components/CanvasElements/Model';
import DataSourceComponent from './components/CanvasElements/DataSource';

// stores
import Backend from 'stores/Backend';

// models
import Model from 'models/Model';

// actions

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
  models: {
    Model: Model
  },
  actions: {}
};

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerCompose = LunchBadgerCompose;
}

module.exports = LunchBadgerCompose;
