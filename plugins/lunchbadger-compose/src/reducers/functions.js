import Function from '../models/Function';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case coreActionTypes.onLoadProject:
      return (action.payload.body.functions || []).reduce((map, item) => {
        map[item.lunchbadgerId] = Function.create(item);
        return map;
      }, {});
    case actionTypes.updateFunction:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.updateFunctions:
      action.payload.forEach((item) => {
        newState[item.id] = item;
      });
      return newState;
    case actionTypes.removeFunction:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      return {};
    default:
      return state;
  }
};
