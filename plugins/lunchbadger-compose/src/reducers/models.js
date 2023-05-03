import uuid from 'uuid';
import Model from '../models/Model';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.onLoadCompose:
      return action.payload[1].body.reduce((map, item) => {
        if (item.kind === 'function') return map;
        if (item.wasBundled) return map;
        item.tmpId = uuid.v4();
        map[item.id] = Model.create(item);
        return map;
      }, {});
    case actionTypes.updateModel:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.updateModels:
      action.payload.forEach((item) => {
        newState[item.id] = item;
      });
      return newState;
    case actionTypes.removeModel:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      return {};
    case coreActionTypes.silentEntityUpdate:
      if (action.payload.entityType === 'models') {
        const entity = Model.create(action.payload.entityData);
        entity.tmpId = uuid.v4();
        if (newState[action.payload.entityId]) {
          entity.locked = newState[action.payload.entityId].locked;
          if (newState[action.payload.entityId].tmpId) {
            entity.tmpId = newState[action.payload.entityId].tmpId;
          }
        }
        newState[action.payload.entityId] = entity;
      }
      return newState;
    case coreActionTypes.silentEntityRemove:
      if (action.payload.entityType === 'models') {
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
