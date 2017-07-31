import Portal from '../models/_portal';

const {actionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  switch (action.type) {
    case actionTypes.onLoadProject:
      return action.payload.body.portals.reduce((map, item) => {
        map[item.id] = Portal.create(item);
        return map;
      }, {});
    default:
      return state;
  }
};
