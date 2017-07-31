import Gateway from '../models/_gateway';

const {actionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  switch (action.type) {
    case actionTypes.onLoadProject:
      return action.payload.body.gateways.reduce((map, item) => {
        map[item.id] = Gateway.create(item);
        return map;
      }, {});
    default:
      return state;
  }
};
