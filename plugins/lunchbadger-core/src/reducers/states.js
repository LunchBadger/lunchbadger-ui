import {actionTypes} from '../reduxActions/actions';

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.setStates:
      newState[action.payload.key] = action.payload.value;
      return newState;
    default:
      return state;
  };
};
