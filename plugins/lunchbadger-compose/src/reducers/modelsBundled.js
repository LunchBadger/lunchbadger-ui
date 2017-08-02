import Model from '../models/_model.js';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActions} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.onLoadModels:
      return action.payload.body.reduce((map, item) => {
        if (!item.wasBundled) return map;
        map[item.lunchbadgerId] = Model.create(item);
        return map;
      }, {});
    // case actionTypes.addModel:
    // case actionTypes.updateModelRequest:
    // case actionTypes.updateModelSuccess:
    // case actionTypes.deleteModelRequest:
    //   newState[action.payload.entity.metadata.id] = action.payload.entity;
    //   return newState;
    // case actionTypes.deleteModelSuccess:
    //   delete newState[action.payload.id];
    //   return newState;
    case coreActions.clearProject:
      return {};
    default:
      return state;
  }
};
