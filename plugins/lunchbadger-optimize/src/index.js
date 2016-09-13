/*eslint no-console:0 */
/*global LUNCHBADGER_CONFIG */
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

// try to load all forecasts
const AppState = LunchBadgerCore.stores.AppState;
const waitForStores = LunchBadgerCore.utils.waitForStores;

waitForStores([AppState]).then(() => {
  setTimeout(() => {

    const apiForecastInformation = AppState.getStateKey('currentForecastInformation');
    const forecastService = new ForecastService(LUNCHBADGER_CONFIG.forecastApiUrl);

    if (apiForecastInformation) {
      forecastService.getByForecast(apiForecastInformation.id).then((data) => {
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
  });
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
