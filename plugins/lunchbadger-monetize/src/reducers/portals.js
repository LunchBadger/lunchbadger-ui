import Portal from '../models/Portal';

const {actionTypes} = LunchBadgerCore.utils;

const initialState = {
  loaded: false,
  data: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.loadProjectSuccess:
      return {
        loaded: true,
        data: action.payload.body.portals.map((item, itemOrder) => Portal.create({
          itemOrder,
          loaded: true,
          ready: true,
          ...item,
        })),
      };
    default:
      return state;
  }
};
