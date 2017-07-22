import Gateway from '../models/Gateway';

const {actionTypes} = LunchBadgerCore.utils;

export default (state = [], action) => {
  switch (action.type) {
    // case actionTypes.loadProjectSuccess:
    //   return action.payload.body.gateways.map((item, itemOrder) => Gateway.create({
    //     itemOrder,
    //     loaded: true,
    //     ready: true,
    //     ...item,
    //     pipelines: [], // FIXME
    //   }));
    default:
      return state;
  }
};
