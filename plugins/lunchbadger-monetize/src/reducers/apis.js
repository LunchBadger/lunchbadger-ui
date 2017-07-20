import API from '../models/API';

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
        data: action.payload.body.apis.map((item, itemOrder) => API.create({
          itemOrder,
          loaded: true,
          ...item,
        })),
      };
    default:
      return state;
  }
};
