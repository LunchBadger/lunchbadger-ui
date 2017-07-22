import PublicEndpoint from '../models/_publicEndpoint';

const {actionTypes} = LunchBadgerCore.utils;

export default (state = [], action) => {
  switch (action.type) {
    case actionTypes.loadProjectSuccess:
      return action.payload.body.publicEndpoints.map(item => PublicEndpoint.create(item));
    default:
      return state;
  }
};
