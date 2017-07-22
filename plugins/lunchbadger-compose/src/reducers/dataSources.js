import DataSource from '../models/_dataSource';
import {actionTypes} from '../reduxActions/actions';

export default (state = [], action) => {
  switch (action.type) {
    case actionTypes.loadDataSourcesSuccess:
      return action.payload.body.map(item => DataSource.create(item, {
        loaded: true,
        ready: true,
      }));
    default:
      return state;
  }
};
