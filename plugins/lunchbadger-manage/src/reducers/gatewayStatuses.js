import slug from 'slug';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  let slugName;
  switch (action.type) {
    case coreActionTypes.onLoadProject:
      return action.payload.body.gateways.reduce((map, item) => {
        slugName = slug(item.name, {lower: true});
        if (!map.hasOwnProperty(slugName)) {
          map[slugName] = false;
        }
        return map;
      }, newState);
    case coreActionTypes.setEntitiesStatus:
      Object.keys(action.payload.gateway || {}).forEach((key) => {
        if (newState[key] === null && action.payload.gateway[key] === false) return;
        newState[key] = action.payload.gateway[key];
      });
      return newState;
    case actionTypes.addGatewayStatus:
      return {...state, [slug(action.payload, {lower: true})]: null};
    default:
      return state;
  }
}
