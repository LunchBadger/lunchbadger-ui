import PrivateEndpoint from '../models/_privateEndpoint';

const {actionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  switch (action.type) {
    case actionTypes.loadProjectSuccess:
      return action.payload.body.privateEndpoints.reduce((map, item) => {
        map[item.id] = PrivateEndpoint.create(item);
        return map;
      }, {});
    default:
      return state;
  }
};
