import APIForecast from 'models/APIForecast';
import ForecastAPI from 'models/ForecastAPI';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (api, left, top) => {
  dispatch('AddAPIForecast', {
    APIForecast: APIForecast.create({
      api: ForecastAPI.create(api.toJSON()),
      left: left || 0,
      top: top || 0
    })
  });
};
