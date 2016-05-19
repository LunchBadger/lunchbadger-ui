// Let's register plugins inside the Core, yay!
import MonetizePlugin from './plugs/MonetizePlugin';

// components
import APIComponent from './components/CanvasElements/API';

// models
import API from './models/API';
import APIPlan from './models/APIPlan';

// actions
import initializePublic from './actions/Stores/Public/initialize';

LunchBadgerCore.actions.registerPlugin(MonetizePlugin);

// export
let LunchBadgerMonetize = {
  components: {
    API: APIComponent
  },
  models: {
    API: API,
    APIPlan: APIPlan
  },
  actions: {
    Stores: {
      Public: {
        initialize: initializePublic
      }
    }
  }
};

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerMonetize = LunchBadgerMonetize;
}

module.exports = LunchBadgerMonetize;
