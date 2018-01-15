import {actionTypes} from '../reduxActions/actions';
import Connections from '../stores/Connections';

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
    case actionTypes.removeEntity:
      const {id} = action.payload;
      Connections.removeConnection(id);
      Connections.removeConnection(null, id);
      return state;
    case actionTypes.clearProject:
      return [];
    default:
      return state;
  }
};
