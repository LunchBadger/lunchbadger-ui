import Gateway from '../models/Gateway';

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
        data: action.payload.body.gateways.map((item, itemOrder) => Gateway.create({
          itemOrder,
          loaded: true,
          ready: true,
          ...item,
          pipelines: [], // FIXME
        })),
      };
    default:
      return state;
  }
};
