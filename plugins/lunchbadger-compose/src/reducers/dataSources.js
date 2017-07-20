import DataSource from '../models/DataSource';
import {actionTypes} from '../reduxActions/actions';

export default (state = [], action) => {
  switch (action.type) {
    case actionTypes.loadDataSourcesSuccess:
      return action.payload.body.map((item, itemOrder) => DataSource.create({
        itemOrder,
        loaded: true,
        ...item,
      }));
    default:
      return state;
  }
};
