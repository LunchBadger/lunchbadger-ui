/*eslint no-console:0 */
// Let's register plugins inside the Core, yay!
import ForecastsPanel from './plugs/ForecastsPanel';

// stores
import Forecast from './stores/Forecast';

// services
import ForecastService from './services/ForecastService';

// actions
import initialize from './actions/APIForecast/initialize';
import setForecast from './actions/AppState/setForecast';

// models
import APIForecast from './models/APIForecast';

LunchBadgerCore.actions.registerPlugin(ForecastsPanel);

import {registerPlugin} from '../../../src/reducers';
import reducers from './reducers';
import plugs from './plugs';

registerPlugin(reducers, plugs);

// try to load all forecasts
const AppState = LunchBadgerCore.stores.AppState;
const waitForStores = LunchBadgerCore.utils.waitForStores;

waitForStores([AppState]).then(() => {
  setTimeout(() => {

    const apiForecastInformation = AppState.getStateKey('currentForecastInformation');

    if (apiForecastInformation) {
      ForecastService.getByForecast(apiForecastInformation.id).then((data) => {
        if (data.body) {
          const forecast = APIForecast.create(Object.assign({}, data.body, {
              left: apiForecastInformation.left || 0,
              top: apiForecastInformation.top || 0
            }
          ));

          initialize(forecast);
          setForecast(forecast, apiForecastInformation.selectedDate, apiForecastInformation.expanded);
        }
      }).catch((error) => {
        return console.warn(error);
      });
    }
  }, 5000); // FIXME
});

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
