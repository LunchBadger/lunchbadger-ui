import _ from 'lodash';
import {actionTypes} from '../reduxActions/actions';
import ConnectionFactory from '../models/Connection';

export default (state = [], action) => {
  let fromId;
  let toId;
  let newFromId;
  let newToId;
  let info;
  let newState = [...state];
  switch (action.type) {
    case actionTypes.addConnection:
      return [
        ...state,
        action.payload,
      ];
    case actionTypes.removeConnection:
      fromId = action.payload.fromId;
      toId = action.payload.toId;
      if (fromId && toId) {
        _.remove(newState, item => item.fromId === fromId && item.toId === toId);
      } else if (fromId) {
        _.remove(newState, item => item.fromId === fromId);
      } else if (toId) {
        _.remove(newState, item => item.toId === toId);
      }
      return newState;
    case actionTypes.removeConnections:
      action.payload.forEach(({fromId, toId}) => {
        if (fromId) {
          _.remove(newState, item => item.fromId === fromId);
        }
        if (toId) {
          _.remove(newState, item => item.toId === toId);
        }
      });
      return newState;
    case actionTypes.moveConnection:
      fromId = action.payload.fromId;
      toId = action.payload.toId;
      newFromId = action.payload.newFromId;
      newToId = action.payload.newToId;
      info = action.payload.info;
      _.remove(newState, item => item.fromId === fromId && item.toId === toId);
      return [
        ...newState,
        ConnectionFactory.create({
          fromId: newFromId,
          toId: newToId,
          info,
        }),
      ];
    case actionTypes.removeEntity:
      const {id} = action.payload;
      _.remove(newState, item => item.fromId === id);
      _.remove(newState, item => item.toId === id);
      return newState;
    default:
      return state;
  }
};
