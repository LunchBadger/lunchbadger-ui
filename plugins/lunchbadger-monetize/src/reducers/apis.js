import API from '../models/API';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case coreActionTypes.onLoadProject:
      return action.payload.body.apis.reduce((map, item) => {
        map[item.id] = API.create(item);
        return map;
      }, {});
    case actionTypes.updateAPI:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.updateAPIs:
      action.payload.forEach((item) => {
        newState[item.id] = item;
      });
      return newState;
    case actionTypes.removeAPI:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      return {};
    case coreActionTypes.silentEntityUpdate:
      if (action.payload.entityType === 'apis') {
        const entity = API.create(action.payload.entityData);
        if (newState[action.payload.entityId]) {
          entity.locked = newState[action.payload.entityId].locked;
        }
        newState[action.payload.entityId] = entity;
      }
      return newState;
    case coreActionTypes.silentEntityRemove:
      if (action.payload.entityType === 'apis') {
        delete newState[action.payload.entityId];
      }
      return newState;
    case coreActionTypes.toggleLockEntity:
      if (!newState[action.payload.entityId]) return state;
      newState[action.payload.entityId].locked = action.payload.locked;
      return newState;
    default:
      return state;
  }
};
