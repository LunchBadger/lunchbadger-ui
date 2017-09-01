import {actionTypes} from '../reduxActions/actions';

export default (state = true, action) => {
  switch (action.type) {
    case actionTypes.setLoadingProject:
      return action.payload;
    case actionTypes.clearProject:
      return true;
    default:
      return state;
  }
};
