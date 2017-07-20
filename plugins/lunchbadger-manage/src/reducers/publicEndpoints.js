import PublicEndpoint from '../models/PublicEndpoint';

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
        data: action.payload.body.publicEndpoints.map((item, itemOrder) => PublicEndpoint.create({
          itemOrder,
          loaded: true,
          ...item,
        })),
      };
    default:
      return state;
  }
};
