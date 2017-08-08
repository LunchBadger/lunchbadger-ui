import Model from '../models/Model.js';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActions} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.onLoadCompose:
      return action.payload[1].body.reduce((map, item) => {
        if (!item.wasBundled) return map;
        map[item.lunchbadgerId] = Model.create(item);
        return map;
      }, {});
    case actionTypes.updateModelBundled:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.removeModelBundled:
      delete newState[action.payload.id];
      return newState;
    case coreActions.clearProject:
      return {};
    default:
      return state;
  }
};
