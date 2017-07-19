import Config from '../../../../src/config';

const ApiClient = LunchBadgerCore.utils.ApiClient;
const getUser = LunchBadgerCore.utils.getUser;

class ForecastService {
  initialize() {
    this._APIHandle = new ApiClient(Config.get('forecastApiUrl'), getUser().idToken);
  }

  get(id) {
    return this._APIHandle.get('Forecasts', {
      qs: {
        filter: JSON.stringify({
          where: {
            api: {
              id,
            }
          }
        })
      }
    });
  }

  getByForecast(forecastId) {
    return this._APIHandle.get(`Forecasts/${forecastId}`);
  }

  save(body) {
    return this._APIHandle.put('Forecasts', {body});
  }
}

export default new ForecastService();
