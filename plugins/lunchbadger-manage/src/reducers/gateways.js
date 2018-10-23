import slug from 'slug';
import Gateway from '../models/Gateway';
import {actionTypes} from '../reduxActions/actions';
import Pipeline from '../models/Pipeline';

const {actionTypes: coreActionTypes, userStorage} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case coreActionTypes.onLoadProject:
      return action.payload.body.gateways.reduce((map, item) => {
        delete item.running;
        delete item.fake;
        delete item.deleting;
        map[item.id] = Gateway.create(item);
        return map;
      }, {});
    case actionTypes.updateGateway:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.updateGateways:
      action.payload.forEach((item) => {
        newState[item.id] = item;
      });
      return newState;
    case actionTypes.removeGateway:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      if (action.payload) return {};
      Object.keys(newState).forEach((key) => {
        newState[key] = Gateway.create(newState[key]);
        newState[key].deleting = true;
        if (!newState[key].fake) {
          const slugId = `${newState[key].id}-${slug(newState[key].name, {lower: true})}`;
          userStorage.setObjectKey('gateway', slugId, newState[key]);
        }
      });
      return newState;
    case actionTypes.addPipeline:
      newState[action.payload].pipelines = [
        ...newState[action.payload].pipelines,
        Pipeline.create(),
      ];
      return newState;
    case actionTypes.unlockGatewayAdminApi:
      delete newState[action.payload].lockedAdminApi;
      return newState;
    case coreActionTypes.silentEntityUpdate:
      if (action.payload.entityType === 'gateways') {
        const entity = action.payload.entityData;
        const isDeploying = !!entity.pipelinesLunchbadger;
        let locked;
        if (newState[action.payload.entityId]) {
          locked = newState[action.payload.entityId].locked;
        }
        newState[action.payload.entityId] = Gateway.create(entity);
        if (locked !== undefined) {
          newState[action.payload.entityId].locked = locked;
        }
        if (isDeploying) {
          newState[action.payload.entityId].running = null;
          newState[action.payload.entityId].lockedAdminApi = true;
        }
      }
      return newState;
    case coreActionTypes.silentEntityRemove:
      if (action.payload.entityType === 'gateways') {
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
