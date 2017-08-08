import {actions} from '../reduxActions/actions';
import {formatId} from '../utils/storeUtils';
import ConnectionFactory from '../models/Connection';

export const addConnection = info => (dispatch) => {
  const fromId = formatId(info.sourceId);
  const toId = formatId(info.targetId);
  dispatch(actions.addConnection(ConnectionFactory.create({fromId, toId, info})));
};

export const moveConnection = info => (dispatch) => {
  const {originalSourceId, originalTargetId, newSourceId, newTargetId} = info;
  dispatch(actions.moveConnection({
    fromId: formatId(originalSourceId),
    toId: formatId(originalTargetId),
    newFromId: formatId(newSourceId),
    newToId: formatId(newTargetId),
    info,
  }));
};

export const removeConnection = (from, to) => (dispatch) => {
  const fromId = formatId(from);
  const toId = formatId(to);
  dispatch(actions.removeConnection({fromId,toId}));
};
