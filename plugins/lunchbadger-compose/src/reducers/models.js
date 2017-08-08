import Model from '../models/Model';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.onLoadCompose:
      return action.payload[1].body.reduce((map, item) => {
        if (item.wasBundled) return map;
        map[item.lunchbadgerId] = Model.create(item);
        return map;
      }, {});
    case actionTypes.updateModel:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.updateModels:
      action.payload.forEach((item) => {
        newState[item.id] = item;
      });
      return newState;
    case actionTypes.removeModel:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      return {};
    default:
      return state;
  }
};
