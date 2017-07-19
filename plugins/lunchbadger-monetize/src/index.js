// Let's register plugins inside the Core, yay!
import MonetizePlugin from './plugs/MonetizePlugin';

// components
import APIComponent from './components/CanvasElements/API';

// models
import API from './models/API';
import APIPlan from './models/APIPlan';
import PlanDetails from './models/PlanDetails';
import PlanParameters from './models/PlanParameters';
import PlanSubscribers from './models/PlanSubscribers';
import Tier from './models/Tier';
import TierDetails from './models/TierDetails';

// actions
import initializePublic from './actions/Stores/Public/initialize';

LunchBadgerCore.actions.registerPlugin(MonetizePlugin);

import {registerPlugin} from '../../../src/reducers';
import reducers from './reducers';
import plugs from './plugs';

registerPlugin(reducers, plugs);

// export
let LunchBadgerMonetize = {
  components: {
    API: APIComponent
  },
  models: {
    API: API,
    APIPlan: APIPlan,
    PlanDetails: PlanDetails,
    PlanParameters: PlanParameters,
    PlanSubscribers: PlanSubscribers,
    Tier: Tier,
    TierDetails: TierDetails
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
