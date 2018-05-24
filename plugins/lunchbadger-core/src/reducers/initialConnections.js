import {actionTypes} from '../reduxActions/actions';
import Connections from '../stores/Connections';
import userStorage from '../utils/userStorage';

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
      userStorage.removeObjectKey('zoomWindow', id);
      return state;
    case actionTypes.clearProject:
      Connections.removeConnections();
      return [];
    default:
      return state;
  }
};
