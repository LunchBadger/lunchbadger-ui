import DataSource from '../models/_dataSource';
import {actionTypes} from '../reduxActions/actions';

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.loadDataSourcesSuccess:
      return action.payload.entities;
    case actionTypes.addDataSource:
    case actionTypes.deleteDataSourceRequest:
    case actionTypes.updateDataSourceRequest:
    case actionTypes.updateDataSourceSuccess:
      newState[action.payload.entity.metadata.id] = action.payload.entity;
      return newState;
    case actionTypes.deleteDataSourceSuccess:
      delete newState[action.payload.id];
      return newState;
    default:
      return state;
  }
};
