// import Model from '../models/_model.js';
import {actionTypes} from '../reduxActions/actions';

export default (state = {}, action) => {
  switch (action.type) {
    case actionTypes.loadModelsSuccess:
      return action.payload.entities;
    default:
      return state;
  }
};
