import Portal from '../models/Portal';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case coreActionTypes.onLoadProject:
      return action.payload.body.portals.reduce((map, item) => {
        map[item.id] = Portal.create(item);
        return map;
      }, {});
    case actionTypes.updatePortal:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.updatePortals:
      action.payload.forEach((item) => {
        newState[item.id] = item;
      });
      return newState;
    case actionTypes.removePortal:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      return {};
    default:
      return state;
  }
};
