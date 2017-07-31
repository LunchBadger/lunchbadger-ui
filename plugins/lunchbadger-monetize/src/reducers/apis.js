import API from '../models/_API';

const {actionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  switch (action.type) {
    case actionTypes.onLoadProject:
      return action.payload.body.apis.reduce((map, item) => {
        map[item.id] = API.create(item);
        return map;
      }, {});
    default:
      return state;
  }
};
