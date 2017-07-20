import Portal from '../models/Portal';

const {actionTypes} = LunchBadgerCore.utils;

export default (state = [], action) => {
  switch (action.type) {
    case actionTypes.loadProjectSuccess:
      return action.payload.body.portals.map((item, itemOrder) => Portal.create({
        itemOrder,
        loaded: true,
        ready: true,
        ...item,
      }));
    default:
      return state;
  }
};
