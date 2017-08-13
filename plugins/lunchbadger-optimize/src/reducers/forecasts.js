import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
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
