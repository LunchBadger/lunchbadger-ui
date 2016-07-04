const APIInterceptor = LunchBadgerCore.utils.APIInterceptor;
const {bindParams} = LunchBadgerCore.utils.URLParams;

class ForecastService {
  constructor() {
    this._APIHandle = new APIInterceptor();
  }

  get(apiId) {
    return this._APIHandle.get('Forecasts', {
      qs: {
        filter: JSON.stringify({
          where: {
            'api.id': apiId
          }
        })
      }
    });
  }

  getByForecast(forecastId) {
    return this._APIHandle.get(bindParams('Forecasts/:id', {id: forecastId}));
  }

  save(forecastId, data) {
    return this._APIHandle.put('Forecasts', {
      body: data
    });
  }
}

export default new ForecastService();
