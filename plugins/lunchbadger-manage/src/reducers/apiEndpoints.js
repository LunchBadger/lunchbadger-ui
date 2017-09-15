import ApiEndpoint from '../models/ApiEndpoint';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case coreActionTypes.onLoadProject:
      return action.payload.body.apiEndpoints.reduce((map, item) => {
        map[item.id] = ApiEndpoint.create(item);
        return map;
      }, {});
    case actionTypes.updateApiEndpoint:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.updateApiEndpoints:
      action.payload.forEach((item) => {
        newState[item.id] = item;
      });
      return newState;
    case actionTypes.removeApiEndpoint:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      return {};
    default:
      return state;
  }
};
