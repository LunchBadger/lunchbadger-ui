import uuid from 'uuid';
import slug from 'slug';
import {diff} from 'just-diff';
import Function_ from '../models/Function';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActionTypes, userStorage} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.onLoadCompose:
      return action.payload[3].body.reduce((map, service) => {
        if (!service.serverless || Object.keys(service.serverless).length === 0) return map;
        const {
          service: name,
          lunchbadger: {id, itemOrder} = {id: uuid.v4(), itemOrder: 0},
        } = service.serverless;
        map[id] = Function_.create({id, name, itemOrder, service});
        return map;
      }, {});
    case actionTypes.updateFunction:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.updateFunctions:
      action.payload.forEach((item) => {
        newState[item.id] = item;
      });
      return newState;
    case actionTypes.removeFunction:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      if (action.payload) return {};
      Object.keys(newState).forEach((key) => {
        newState[key] = Function_.create(newState[key]);
        newState[key].deleting = true;
        if (!newState[key].fake) {
          const slugId = `${newState[key].id}-${slug(newState[key].name, {lower: true})}`;
          userStorage.setObjectKey('function', slugId, newState[key]);
        }
      });
      return newState;
    case coreActionTypes.silentEntityUpdate:
      if (action.payload.entityType === 'functions') {
        const entity = Function_.create(action.payload.entityData);
        let isDeploying = true;
        const prevEntity = newState[action.payload.entityId];
        if (prevEntity) {
          const delta = diff(prevEntity.toJSON(), entity.toJSON());
          if (delta.length === 0) return newState;
          if (
            delta.length === 2
            &&
            delta[0].op === 'replace'
            &&
            delta[0].path.join(',') === 'itemOrder'
            &&
            delta[1].op === 'replace'
            &&
            delta[1].path.join(',') === 'service,serverless,lunchbadger,itemOrder'
          ) {
            isDeploying = false;
          }
        }
        if (isDeploying) {
          entity.running = null;
        }
        newState[action.payload.entityId] = entity;
      }
      return newState;
    case coreActionTypes.silentEntityRemove:
      if (action.payload.entityType === 'functions') {
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
