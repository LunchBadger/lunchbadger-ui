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
            api: {
              id: apiId
            }
          }
        })
      }
    });
  }

  save(forecastId, data) {
    delete data.id;

    return this._APIHandle.put(bindParams('Forecasts/:id', {id: forecastId}), {
      body: data
    });
  }
}

export default new ForecastService();
