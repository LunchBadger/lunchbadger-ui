import {actionTypes} from '../reduxActions/actions';

export default (state = [], action) => {
  switch (action.type) {
    case actionTypes.onLoadProject:
      return [
        ...state,
        ...action.payload.body.connections,
      ];
    case actionTypes.addInitialConnections:
      return [
        ...state,
        ...action.payload,
      ];
    default:
      return state;
  }
};
