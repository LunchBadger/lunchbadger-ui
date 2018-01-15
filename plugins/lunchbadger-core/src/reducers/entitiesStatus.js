import {actionTypes} from '../reduxActions/actions';

const initialState = {
  gateway: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setEntitiesStatus:
      return action.payload;
    default:
      return state;
  }
};
