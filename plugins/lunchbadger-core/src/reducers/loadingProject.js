import {actionTypes} from '../reduxActions/actions';

export default (state = true, action) => {
  switch (action.type) {
    case actionTypes.setLoadingProject:
      return action.payload;
    default:
      return state;
  }
};
