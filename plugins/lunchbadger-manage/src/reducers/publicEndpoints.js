import PublicEndpoint from '../models/PublicEndpoint';

const {actionTypes} = LunchBadgerCore.utils;

export default (state = [], action) => {
  switch (action.type) {
    // case actionTypes.loadProjectSuccess:
    //   return action.payload.body.publicEndpoints.map((item, itemOrder) => PublicEndpoint.create({
    //     itemOrder,
    //     loaded: true,
    //     ...item,
    //   }));
    default:
      return state;
  }
};
