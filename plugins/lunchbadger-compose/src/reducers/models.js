// import Model from '../models/_model.js';
import {actionTypes} from '../reduxActions/actions';

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.loadModelsSuccess:
      return action.payload.entities;
    case actionTypes.addModel:
    // case actionTypes.deleteModelRequest:
    // case actionTypes.updateModelRequest:
    // case actionTypes.updateModelSuccess:
      newState[action.payload.entity.metadata.id] = action.payload.entity;
      return newState;
    case actionTypes.deleteModelSuccess:
      delete newState[action.payload.id];
      return newState;
    default:
      return state;
  }
};
