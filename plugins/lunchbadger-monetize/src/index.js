import APIPlan from './models/APIPlan';
import PlanDetails from './models/PlanDetails';
import PlanParameters from './models/PlanParameters';
import PlanSubscribers from './models/PlanSubscribers';
import Tier from './models/Tier';
import TierDetails from './models/TierDetails';

// import {registerPlugin} from '../../../src/reducers';
import reducers from './reducers';
import plugs from './plugs';

const {registerPlugin} = LunchBadgerCore.utils;
registerPlugin(reducers, plugs);

const LunchBadgerMonetize = {
  models: {
    APIPlan,
    PlanDetails,
    PlanParameters,
    PlanSubscribers,
    Tier,
    TierDetails,
  },
};

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerMonetize = LunchBadgerMonetize;
}

module.exports = LunchBadgerMonetize;
