import Portal from '../models/_Portal';
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
    case actionTypes.addPortal:
    case actionTypes.updatePortalRequest:
    case actionTypes.updatePortalSuccess:
    case actionTypes.deletePortalRequest:
      newState[action.payload.entity.metadata.id] = action.payload.entity;
      return newState;
    case actionTypes.deletePortalSuccess:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      return {};
    default:
      return state;
  }
};
