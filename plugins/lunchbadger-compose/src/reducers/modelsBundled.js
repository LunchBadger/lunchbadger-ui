import uuid from 'uuid';
import Model from '../models/Model.js';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.onLoadCompose:
      return action.payload[1].body.reduce((map, item) => {
        if (item.kind === 'function') return map;
        if (!item.wasBundled) return map;
        if (!item.lunchbadgerId) {
          item.lunchbadgerId = uuid.v4();
        }
        map[item.lunchbadgerId] = Model.create(item);
        return map;
      }, {});
    case actionTypes.updateModelBundled:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.removeModelBundled:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      return {};
    default:
      return state;
  }
};
