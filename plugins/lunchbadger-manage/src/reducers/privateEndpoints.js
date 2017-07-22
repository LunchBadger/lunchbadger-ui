import PrivateEndpoint from '../models/_privateEndpoint';

const {actionTypes} = LunchBadgerCore.utils;

export default (state = [], action) => {
  switch (action.type) {
    case actionTypes.loadProjectSuccess:
      return action.payload.body.privateEndpoints.map(item => PrivateEndpoint.create(item));
    default:
      return state;
  }
};
