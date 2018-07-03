import uuid from 'uuid';
import DataSource from '../models/DataSource';
import {actionTypes} from '../reduxActions/actions';
import catchDatasourceErrors from '../utils/catchDatasourceErrors.js';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.onLoadCompose:
      return action.payload[0].body.reduce((map, item) => {
        if (!item.lunchbadgerId) {
          item.lunchbadgerId = uuid.v4();
        }
        if (item.hasOwnProperty('wsdl')) {
          item.soapOperations = item.operations || {};
          delete item.operations;
        }
        map[item.lunchbadgerId] = DataSource.create(item);
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
    default:
      return state;
  }
};
