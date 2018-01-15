import {actionTypes} from '../reduxActions/actions';

export default (state = false, action) => {
  switch (action.type) {
    case actionTypes.setLoadedProject:
      return action.payload;
    default:
      return state;
  }
};
