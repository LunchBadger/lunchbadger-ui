const APIInterceptor = LunchBadgerCore.utils.APIInterceptor;
const {bindParams} = LunchBadgerCore.utils.URLParams;

class ForecastService {
  constructor() {
    this._APIHandle = new APIInterceptor();
  }

  get(apiId) {
    return this._APIHandle.get('Forecasts', {
      qs: {
        filter: `{"apiId": "${apiId}"}`
      }
    });
  }
}

export default new ForecastService();
