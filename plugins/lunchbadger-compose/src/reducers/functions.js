import Function_ from '../models/Function';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.onLoadCompose:
      return action.payload[3].body.reduce((map, service) => {
        if (!service.serverless) return map;
        const {service: name, lunchbadger: {id, itemOrder}} = service.serverless;
        map[id] = Function_.create({id, name, itemOrder, service});
        return map;
      }, {});
    case actionTypes.updateFunction:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.updateFunctions:
      action.payload.forEach((item) => {
        newState[item.id] = item;
      });
      return newState;
    case actionTypes.removeFunction:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      return {};
    default:
      return state;
  }
};
