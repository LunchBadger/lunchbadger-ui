import Microservice from '../models/Microservice';

const {actionTypes} = LunchBadgerCore.utils;

export default (state = [], action) => {
  switch (action.type) {
    case actionTypes.loadProjectSuccess:
      return action.payload.body.microServices.map((item, itemOrder) => Microservice.create({
        itemOrder,
        loaded: true,
        ready: true,
        ...item,
      }));
    default:
      return state;
  }
};
