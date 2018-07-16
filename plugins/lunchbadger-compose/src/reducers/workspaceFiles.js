import {actionTypes} from '../reduxActions/actions';

export default (state = {}, action) => {
  switch (action.type) {
    case actionTypes.updateWorkspaceFiles:
      return action.payload;
    default:
      return state;
  }
};
