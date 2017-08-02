import Gateway from '../models/_gateway';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  switch (action.type) {
    case coreActionTypes.onLoadProject:
      return action.payload.body.gateways.reduce((map, item) => {
        map[item.id] = Gateway.create(item);
        return map;
      }, {});
    case coreActionTypes.clearProject:
      return {};
    default:
      return state;
  }
};
