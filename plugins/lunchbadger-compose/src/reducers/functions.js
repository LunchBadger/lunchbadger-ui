import uuid from 'uuid';
import Function from '../models/Function';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.onLoadCompose:
      return action.payload[1].body.reduce((map, item) => {
        if (item.kind !== 'function') return map;
        if (item.wasBundled) return map;
        if (!item.lunchbadgerId) {
          item.lunchbadgerId = uuid.v4();
        }
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
