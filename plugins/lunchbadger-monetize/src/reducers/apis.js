import API from '../models/API';

const {actionTypes} = LunchBadgerCore.utils;

export default (state = [], action) => {
  switch (action.type) {
    // case actionTypes.loadProjectSuccess:
    //   return action.payload.body.apis.map((item, itemOrder) => API.create({
    //     itemOrder,
    //     loaded: true,
    //     ...item,
    //   }));
    default:
      return state;
  }
};
