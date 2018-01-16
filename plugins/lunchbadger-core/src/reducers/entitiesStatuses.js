import {actionTypes} from '../reduxActions/actions';

export default (state = {}, action) => {
  switch (action.type) {
    case actionTypes.setEntitiesStatuses:
      return action.payload;
    default:
      return state;
  }
};
