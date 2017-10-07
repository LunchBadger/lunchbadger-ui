import {addAndConnect} from './apiEndpoints';

const {storeUtils} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

export const attach = info => (dispatch, getState) => {
  info.connection.setType('wip');
  const {sourceId, targetId} = info;
  const endpoint = storeUtils.findEntity(getState(), 1, sourceId);
  if (endpoint) {
    const pipelineId = storeUtils.formatId(targetId);
    if (!Connections.findHistory({fromId: endpoint.id, toId: pipelineId})) {
      const outPort = document.getElementById(`port_out_${pipelineId}`).querySelector('.port__anchor');
      dispatch(addAndConnect(endpoint, pipelineId, outPort));
    }
  }
  Connections.addConnectionByInfo(info);
  info.connection.removeType('wip');
};

export const reattach = info => async (dispatch, getState) => {
  info.connection.setType('wip');
  const {newSourceId, newTargetId} = info;
  const endpoint = storeUtils.findEntity(getState(), 1, newSourceId);
  if (endpoint) {
    const pipelineId = storeUtils.formatId(newTargetId);
    if (!Connections.findHistory({fromId: endpoint.id, toId: pipelineId})) {
      const outPort = document.getElementById(`port_out_${pipelineId}`).querySelector('.port__anchor');
      dispatch(addAndConnect(endpoint, pipelineId, outPort));
    }
  }
  Connections.moveConnection(info);
  info.connection.removeType('wip');
}
