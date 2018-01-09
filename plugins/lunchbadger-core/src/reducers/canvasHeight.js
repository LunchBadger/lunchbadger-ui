import {actionTypes} from '../reduxActions/actions';

export default (state = null, action) => {
  switch (action.type) {
    case actionTypes.setCanvasHeight:
      return action.payload;
    default:
      return state;
  }
}
