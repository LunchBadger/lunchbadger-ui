const ApiClient = LunchBadgerCore.utils.ApiClient;
const {bindParams} = LunchBadgerCore.utils.URLParams;

export default class ForecastService {
  constructor(apiUrl, idToken) {
    this._APIHandle = new ApiClient(apiUrl, idToken);
  }

  get(apiId) {
    return this._APIHandle.get('Forecasts', {
      qs: {
        filter: JSON.stringify({
          where: {
            // 'api.id': apiId
            api: {
              id: apiId
            }
          }
        })
      }
    });
  }

  getByForecast(forecastId) {
    return this._APIHandle.get(bindParams('Forecasts/:id', {id: forecastId}));
  }

  save(data) {
    return this._APIHandle.put('Forecasts', {
      body: data
    });
  }
}
