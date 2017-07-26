import PublicEndpoint from '../models/_publicEndpoint';

const {actionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  switch (action.type) {
    case actionTypes.loadProjectSuccess:
      return action.payload.body.publicEndpoints.reduce((map, item) => {
        map[item.id] = PublicEndpoint.create(item);
        return map;
      }, {});
    default:
      return state;
  }
};
