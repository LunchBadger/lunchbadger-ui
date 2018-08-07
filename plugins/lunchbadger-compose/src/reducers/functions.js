import uuid from 'uuid';
import slug from 'slug';
import Function_ from '../models/Function';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActionTypes, userStorage} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.onLoadCompose:
      return action.payload[3].body.reduce((map, service) => {
        if (!service.serverless || Object.keys(service.serverless).length === 0) return map;
        const {
          service: name,
          lunchbadger: {id, itemOrder} = {id: uuid.v4(), itemOrder: 0},
        } = service.serverless;
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
      if (action.payload) return {};
      Object.keys(newState).forEach((key) => {
        newState[key] = Function_.create(newState[key]);
        newState[key].deleting = true;
        if (!newState[key].fake) {
          const slugId = `${newState[key].id}-${slug(newState[key].name, {lower: true})}`;
          userStorage.setObjectKey('function', slugId, newState[key]);
        }
      });
      return newState;
    default:
      return state;
  }
};
