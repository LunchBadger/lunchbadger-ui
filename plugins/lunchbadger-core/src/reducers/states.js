import {actionTypes} from '../reduxActions/actions';

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.onLoadProject:
      action.payload.body.states.forEach((item) => {
        newState[item.key] = item.value;
      });
      return newState;
    case actionTypes.setState:
      newState[action.payload.key] = action.payload.value;
      return newState;
    case actionTypes.setStates:
      action.payload.forEach(({key, value}) => newState[key] = value);
      return newState;
    default:
      return state;
  }
};
