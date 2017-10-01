import {addAndConnect} from './apiEndpoints';
import {addServiceEndpointIntoProxy, removeServiceEndpointFromProxy} from './gateways';

const {coreActions, storeUtils} = LunchBadgerCore.utils;
const {Connections} = LunchBadgerCore.stores;

export const attach = info => async (dispatch, getState) => {
  info.connection.setType('wip');
  const {sourceId, targetId} = info;
  const endpoint = storeUtils.findEntity(getState(), 1, sourceId);
  if (endpoint) {
    const pipelineId = storeUtils.formatId(targetId);
    dispatch(addServiceEndpointIntoProxy(endpoint.id, pipelineId));
    if (!Connections.findHistory({fromId: endpoint.id, toId: pipelineId})) {
      const outPort = document.getElementById(`port_out_${pipelineId}`).querySelector('.port__anchor');
      dispatch(addAndConnect(endpoint, pipelineId, outPort));
    }
  }
  Connections.addConnectionByInfo(info);
  // await dispatch(coreActions.saveToServer());
  info.connection.removeType('wip');
};

export const detach = info => async (dispatch, getState) => {
  const {sourceId, targetId} = info;
  const endpoint = storeUtils.findEntity(getState(), 1, sourceId);
  if (endpoint) {
    const pipelineId = storeUtils.formatId(targetId);
    dispatch(removeServiceEndpointFromProxy(endpoint.id, pipelineId));
  }
  Connections.removeConnection(sourceId, targetId);
  // await dispatch(coreActions.saveToServer());
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
  // await dispatch(coreActions.saveToServer());
  info.connection.removeType('wip');
}
