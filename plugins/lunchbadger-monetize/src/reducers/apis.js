import API from '../models/_API';

const {actionTypes} = LunchBadgerCore.utils;

export default (state = [], action) => {
  switch (action.type) {
    case actionTypes.loadProjectSuccess:
      return action.payload.body.apis.map(item => API.create(item));
    default:
      return state;
  }
};
