import API from '../models/_API';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  switch (action.type) {
    case coreActionTypes.onLoadProject:
      return action.payload.body.apis.reduce((map, item) => {
        map[item.id] = API.create(item);
        return map;
      }, {});
    case coreActionTypes.clearProject:
      return {};
    default:
      return state;
  }
};
