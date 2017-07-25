import Gateway from '../models/_gateway';

const {actionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  switch (action.type) {
    // case actionTypes.loadProjectSuccess:
    //   return action.payload.body.gateways.map(item => Gateway.create(item));
    default:
      return state;
  }
};
