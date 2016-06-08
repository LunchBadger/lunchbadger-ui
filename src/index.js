// Let's register plugins inside the Core, yay!
import ForecastsPanel from './plugs/ForecastsPanel';

// stores
import Forecast from './stores/Forecast';

// services
import ForecastService from './services/ForecastService';

LunchBadgerCore.actions.registerPlugin(ForecastsPanel);

// export
let LunchBadgerOptimize = {
  stores: {
    Forecast: Forecast
  },
  services: {
    ForecastService: ForecastService
  }
};

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerOptimize = LunchBadgerOptimize;
}

module.exports = LunchBadgerOptimize;
