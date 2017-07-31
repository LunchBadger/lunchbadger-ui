import PrivateEndpoint from '../models/_privateEndpoint';
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
    case actionTypes.addPrivateEndpoint:
    case actionTypes.updatePrivateEndpointRequest:
    case actionTypes.updatePrivateEndpointSuccess:
    case actionTypes.deletePrivateEndpointRequest:
      newState[action.payload.entity.metadata.id] = action.payload.entity;
      return newState;
    case actionTypes.deletePrivateEndpointSuccess:
      delete newState[action.payload.id];
      return newState;
    default:
      return state;
  }
};
