import PrivateEndpoint from '../models/PrivateEndpoint';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case coreActionTypes.onLoadProject:
      return action.payload.body.privateEndpoints.reduce((map, item) => {
        map[item.id] = PrivateEndpoint.create(item);
        return map;
      }, {});
    case actionTypes.updatePrivateEndpoint:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.removePrivateEndpoint:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      return {};
    default:
      return state;
  }
};
