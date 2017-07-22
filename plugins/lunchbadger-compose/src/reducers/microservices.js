import Microservice from '../models/_microService';

const {actionTypes} = LunchBadgerCore.utils;

export default (state = [], action) => {
  switch (action.type) {
    case actionTypes.loadProjectSuccess:
      return action.payload.body.microServices.map(item => Microservice.create(item));
    default:
      return state;
  }
};
