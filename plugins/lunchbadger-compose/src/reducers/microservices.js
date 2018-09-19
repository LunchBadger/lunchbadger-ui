import Microservice from '../models/Microservice';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case coreActionTypes.onLoadProject:
      return (action.payload.body.microServices || []).reduce((map, item) => {
        map[item.id] = Microservice.create(item);
        return map;
      }, {});
    case actionTypes.updateMicroservice:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.updateMicroservices:
      action.payload.forEach((item) => {
        newState[item.id] = item;
      });
      return newState;
    case actionTypes.removeMicroservice:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      return {};
    case coreActionTypes.silentEntityUpdate:
      if (action.payload.entityType === 'microservices') {
        newState[action.payload.entityId] = Microservice.create(action.payload.entityData);
      }
      return newState;
    case coreActionTypes.silentEntityRemove:
      if (action.payload.entityType === 'microservices') {
        delete newState[action.payload.entityId];
      }
      return newState;
    default:
      return state;
  }
};
