// Let's register plugins inside the Core, yay!
import MonetizePlugin from './plugs/MonetizePlugin';

// components
import APIComponent from './components/CanvasElements/API';

// models
import API from './models/API';

LunchBadgerCore.actions.registerPlugin(MonetizePlugin);

// export
let LunchBadgerMonetize = {
  components: {
    API: APIComponent
  },
  models: {
    API: API
  }
};

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerMonetize = LunchBadgerMonetize;
}

module.exports = LunchBadgerMonetize;
