const APIInterceptor = LunchBadgerCore.utils.APIInterceptor;

class ForecastService {
  constructor() {
    this._APIHandle = new APIInterceptor();
  }

  get(apiId) {
    return this._APIHandle.get('Forecasts', {
      qs: {
        filter: JSON.stringify({
          where: {
            apiId: apiId
          }
        })
      }
    });
  }
}

export default new ForecastService();
