import PublicEndpoint from '../models/PublicEndpoint';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case coreActionTypes.onLoadProject:
      return action.payload.body.publicEndpoints.reduce((map, item) => {
        map[item.id] = PublicEndpoint.create(item);
        return map;
      }, {});
    case actionTypes.updatePublicEndpoint:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.removePublicEndpoint:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      return {};
    default:
      return state;
  }
};
