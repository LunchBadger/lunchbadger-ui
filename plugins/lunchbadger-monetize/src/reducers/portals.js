import Portal from '../models/_portal';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  switch (action.type) {
    case coreActionTypes.onLoadProject:
      return action.payload.body.portals.reduce((map, item) => {
        map[item.id] = Portal.create(item);
        return map;
      }, {});
    case coreActionTypes.clearProject:
      return {};
    default:
      return state;
  }
};
