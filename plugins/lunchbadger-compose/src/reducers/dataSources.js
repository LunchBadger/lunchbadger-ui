import DataSource from '../models/DataSource';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.onLoadDataSources:
      return action.payload.body.reduce((map, item) => {
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
    default:
      return state;
  }
};
