import {actionTypes} from '../reduxActions/actions';

export default (state = {}, action) => {
  switch (action.type) {
    case actionTypes.onLoadCompose:
      return action.payload[4].body;
    case actionTypes.updateWorkspaceFiles:
      return action.payload;
    default:
      return state;
  }
};
