import PublicEndpoint from '../models/_publicEndpoint';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  switch (action.type) {
    case coreActionTypes.onLoadProject:
      return action.payload.body.publicEndpoints.reduce((map, item) => {
        map[item.id] = PublicEndpoint.create(item);
        return map;
      }, {});
    case coreActionTypes.clearProject:
      return {};
    default:
      return state;
  }
};
