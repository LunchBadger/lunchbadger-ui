import APIForecast from 'models/APIForecast';

const API = LunchBadgerMonetize.models.API;
const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (api, left, top) => {
  dispatch('AddAPIForecast', {
    APIForecast: APIForecast.create({
      api: API.create(api.toJSON()),
      left: left || 0,
      top: top || 0
    })
  });
};
