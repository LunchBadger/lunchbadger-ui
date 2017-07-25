import Microservice from '../models/_microService';

const {actionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  switch (action.type) {
    case actionTypes.loadProjectSuccess:
      return action.payload.body.microServices.reduce((map, item) => {
        map[item.id] = Microservice.create(item);
        return map;
      }, {});
    default:
      return state;
  }
};
