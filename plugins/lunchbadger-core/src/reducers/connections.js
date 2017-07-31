import {actionTypes} from '../reduxActions/actions';

export default (state = [], action) => {
  switch (action.type) {
    case actionTypes.onLoadProject:
      return action.payload.body.connections;
    default:
      return state;
  }
};
