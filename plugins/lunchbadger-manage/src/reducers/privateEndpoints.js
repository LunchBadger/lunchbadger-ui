import PrivateEndpoint from '../models/PrivateEndpoint';

const {actionTypes} = LunchBadgerCore.utils;

export default (state = [], action) => {
  switch (action.type) {
    // case actionTypes.loadProjectSuccess:
    //   return action.payload.body.privateEndpoints.map((item, itemOrder) => PrivateEndpoint.create({
    //     itemOrder,
    //     loaded: true,
    //     ...item,
    //   }));
    default:
      return state;
  }
};
