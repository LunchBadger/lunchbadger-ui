import DataSource from '../models/_dataSource';
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
    case actionTypes.addDataSource:
    case actionTypes.updateDataSourceRequest:
    case actionTypes.updateDataSourceSuccess:
    case actionTypes.deleteDataSourceRequest:
      newState[action.payload.entity.metadata.id] = action.payload.entity;
      return newState;
    case actionTypes.deleteDataSourceSuccess:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      return {};
    default:
      return state;
  }
};
