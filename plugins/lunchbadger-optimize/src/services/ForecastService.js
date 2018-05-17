import Config from '../../../../src/config';

const {ApiClient, getUser} = LunchBadgerCore.utils;

class ForecastService {

  initialize = () => this.api = new ApiClient(Config.get('forecastApiUrl'), getUser().id_token);

  get = id => this.api.get('/Forecasts', {
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

  getByForecast = id => this.api.get(`/Forecasts/${id}`);

  save = body => this.api.put('/Forecasts', {body});

}

export default new ForecastService();
