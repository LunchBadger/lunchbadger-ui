import Microservice from '../models/_microService';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActions} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case coreActions.onLoadProject:
    return action.payload.body.microServices.reduce((map, item) => {
      map[item.id] = Microservice.create(item);
      return map;
    }, {});
    case actionTypes.addMicroservice:
    case actionTypes.updateMicroserviceRequest:
    case actionTypes.updateMicroserviceSuccess:
    case actionTypes.deleteMicroserviceRequest:
      newState[action.payload.entity.metadata.id] = action.payload.entity;
      return newState;
    case actionTypes.deleteMicroserviceSuccess:
      delete newState[action.payload.id];
      return newState;
    default:
      return state;
  }
};
