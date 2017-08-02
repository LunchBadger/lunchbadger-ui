import PublicEndpoint from '../models/_publicEndpoint';
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
    case actionTypes.addPublicEndpoint:
    case actionTypes.updatePublicEndpointRequest:
    case actionTypes.updatePublicEndpointSuccess:
    case actionTypes.deletePublicEndpointRequest:
      newState[action.payload.entity.metadata.id] = action.payload.entity;
      return newState;
    case actionTypes.deletePublicEndpointSuccess:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      return {};
    default:
      return state;
  }
};
