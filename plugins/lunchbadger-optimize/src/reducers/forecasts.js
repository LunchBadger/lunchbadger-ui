import {actionTypes} from '../reduxActions/actions';
import APIForecast from '../models/APIForecast';
import ForecastAPI from '../models/ForecastAPI';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case coreActionTypes.onLoadProject:
      const currentForecast = action.payload.body.states.find(({key}) => key === 'currentForecast');
      if (currentForecast) {
        const {id, left = 0, top = 0} = currentForecast.value;
        const api = ForecastAPI.create({id, name: 'API'});
        const forecast = APIForecast.create({id, api, left, top});
        newState[forecast.id] = forecast;
        return newState;
      }
      return state;
    case actionTypes.updateForecast:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.updateForecasts:
      action.payload.forEach((item) => {
        newState[item.id] = item;
      });
      return newState;
    case actionTypes.removeForecast:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      return {};
    default:
      return state;
  }
};
