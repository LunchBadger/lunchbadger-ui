import Portal from '../models/_portal';

const {actionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  switch (action.type) {
    // case actionTypes.loadProjectSuccess:
    //   return action.payload.body.portals.map(item => Portal.create(item));
    default:
      return state;
  }
};
