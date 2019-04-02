import uuid from 'uuid';
import DataSource from '../models/DataSource';
import {actionTypes} from '../reduxActions/actions';
import catchDatasourceErrors from '../utils/catchDatasourceErrors.js';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

const processDataSource = (item, state) => {
  if (item.hasOwnProperty('wsdl')) {
    item.soapOperations = item.operations || {};
    delete item.operations;
  }
  if (state && state[item.id] && state[item.id].tmpId) {
    item.tmpId = state[item.id].tmpId;
  } else {
    item.tmpId = uuid.v4();
  }
  return item;
};

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.onLoadCompose:
      return action.payload[0].body.reduce((map, item) => {
        processDataSource(item, newState);
        map[item.id] = DataSource.create(item);
        return map;
      }, {});
    case actionTypes.updateDataSource:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.updateDataSources:
      action.payload.forEach((item) => {
        newState[item.id] = item;
      });
      return newState;
    case actionTypes.removeDataSource:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      return {};
    case coreActionTypes.addEntityError:
      return catchDatasourceErrors(state, action.payload);
    case coreActionTypes.silentEntityUpdate:
      if (action.payload.entityType === 'dataSources') {
        const entity = DataSource.create(processDataSource(action.payload.entityData, newState));
        if (newState[action.payload.entityId]) {
          entity.locked = newState[action.payload.entityId].locked;
        }
        newState[action.payload.entityId] = entity;
      }
      return newState;
    case coreActionTypes.silentEntityRemove:
      if (action.payload.entityType === 'dataSources') {
        delete newState[action.payload.entityId];
      }
      return newState;
    case coreActionTypes.clearSystemDefcon1:
      Object.values(newState).forEach(entity => entity.error = null);
      return newState;
    case coreActionTypes.toggleLockEntity:
      if (!newState[action.payload.entityId]) return state;
      newState[action.payload.entityId].locked = action.payload.locked;
      return newState;
    default:
      return state;
  }
};
