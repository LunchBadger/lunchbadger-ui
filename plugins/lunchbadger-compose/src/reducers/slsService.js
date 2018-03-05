import {actionTypes} from '../reduxActions/actions';

export default (state = [], action) => {
  switch (action.type) {
    case actionTypes.onLoadCompose:
      return action.payload[3].body;
    case actionTypes.updateSlsService:
      return action.payload;
    default:
      return state;
  }
};
