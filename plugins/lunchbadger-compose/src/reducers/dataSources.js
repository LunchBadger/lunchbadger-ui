import DataSource from '../models/DataSource';
import {actionTypes} from '../reduxActions/actions';

const initialState = {
  loaded: false,
  data: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.loadDataSourcesSuccess:
      return {
        loaded: true,
        data: action.payload.body.map((item, itemOrder) => DataSource.create({
          itemOrder,
          loaded: true,
          ...item,
        })),
      };
    default:
      return state;
  }
};
