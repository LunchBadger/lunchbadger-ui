import React from 'react';
import {actions} from './actions';
import Gateway from '../models/Gateway';
import Pipeline from '../models/Pipeline';
import Policy from '../models/Policy';
import ApiEndpoint from '../models/ApiEndpoint';

const {
  coreActions,
  actions: actionsCore,
  userStorage,
} = LunchBadgerCore.utils;

const transformGateways = (entities) => {
  const gateways = {};
  Object.values(entities)
    .filter(({id, loaded}) => id !== 'autogenerated' && loaded)
    .forEach((gateway) => {
      gateways[gateway.id] = gateway;
    });
  return gateways;
};

const autogeneratedGatewayTemplate = {
  id: 'autogenerated',
  name: 'autogenerated',
  running: true,
  itemOrder: 1000,
  pipelines: [{
    id: 'autogeneratedPipeline',
    name: 'api',
    policies: [],
  }],
};

const combineEntities = (statuses, gateways) => {
  const entries = {};
  Object.keys(statuses).forEach((id) => {
    const isAutogenerated = id.includes('dev000');
    entries[id] = statuses[id];
    if (gateways[isAutogenerated ? 'autogenerated' : id]) {
      entries[id].entity = gateways[isAutogenerated ? 'autogenerated' : id];
    } else {
      if (isAutogenerated) {
        entries[id].entity = Gateway.create(autogeneratedGatewayTemplate);
      } else {
        entries[id].entity = null;
      }
    }
  });
  Object.keys(gateways).forEach((id) => {
    if (entries[id]) {

    } else {
      entries[id] = {
        status: null,
        entity: gateways[id],
      };
    }
  });
  return entries;
};

const showGatewayStatusChangeMessage = (dispatch, name, message) => {
  dispatch(actionsCore.addSystemInformationMessage({
    type: 'success',
    message: (
      <span>
        <strong>{name}</strong>
        {' '}
        {message}
      </span>
    ),
  }));
};

export const onGatewayStatusChange = () => async (dispatch, getState) => {
  const state = getState();
  const {entitiesStatuses, entities: {gateways: entities}} = state;
  const statuses = entitiesStatuses.gateway || {};
  const gateways = transformGateways(entities);
  const entries = combineEntities(statuses, gateways);
  let updatedEntity;
  let isSave = false;
  let unlockAdminApi = [];
  Object.keys(entries).forEach(async (slugId) => {
    const {status, entity, slug, pods} = entries[slugId];
    const {
      running: gatewayRunning,
      deleting: gatewayDeleting,
      name: gatewayName,
    } = entity || {};
    if (status === null) {
      if (gatewayDeleting) {
        dispatch(actions.removeGateway(entity));
        userStorage.removeObjectKey('gateway', slugId);
      } else {
        const hasPipelinesLunchbadger = typeof entity.pipelinesLunchbadger === 'object';
        updatedEntity = entity.recreate();
        updatedEntity.running = hasPipelinesLunchbadger ? null : false;
        if (hasPipelinesLunchbadger) {
          updatedEntity.pipelinesLunchbadger = entity.pipelinesLunchbadger;
        }
        dispatch(actions.updateGateway(updatedEntity));
      }
    } else {
      if (entity === null) {
        /* relict since deleting functions are not rendered */
        // const storageGateway = userStorage.getObjectKey('gateway', slugId) || {};
        // const fake = !storageGateway.name;
        // updatedEntity = Gateway.create({
        //   ...storageGateway,
        //   name: slug,
        //   fake,
        //   deleting: true,
        //   running,
        //   itemOrder: 1000,
        // });
        // dispatch(actions.updateGateway(updatedEntity));
      } else {
        const {running: statusRunning, deployment: {inProgress}} = status;
        const pod = Object.keys(pods).find(key => pods[key].servesRequests);
        const running = statusRunning && !inProgress && !!pod;
        updatedEntity = entity.recreate();
        updatedEntity.pipelinesLunchbadger = entity.pipelinesLunchbadger;
        if (pod) {
          const podArr = pod.split('-');
          const podName = podArr[podArr.length - 3];
          if (updatedEntity.podName !== podName) {
            updatedEntity.podName = podName;
          }
        }
        let message;
        let gatewayUpdated = false;
        const hasPipelinesLunchbadger = typeof entity.pipelinesLunchbadger === 'object';
        if (running && hasPipelinesLunchbadger) {
          updatedEntity.pipelines = entity.pipelinesLunchbadger.map(p => Pipeline.create(p));
          updatedEntity.pipelinesLunchbadger = undefined;
          updatedEntity.running = true;
          if (updatedEntity.lockedAdminApi) {
            unlockAdminApi.push(entity.id);
          }
          isSave = true;
          dispatch(actions.updateGateway(updatedEntity));
          gatewayUpdated = true;
          message = 'successfully deployed';
        }
        if (running !== gatewayRunning) {
          if (gatewayDeleting) return;
          if (!running && gatewayRunning === null) return;
          updatedEntity.running = running;
          if (!running && gatewayRunning && hasPipelinesLunchbadger) {
            updatedEntity.running = null;
          } else if (!running && gatewayRunning && updatedEntity.id === 'autogenerated') {
            updatedEntity.running = null;
          } else if (!message && updatedEntity.id !== 'autogenerated') {
            message = `is ${running ? '' : 'not'} running`;
          }
          dispatch(actions.updateGateway(updatedEntity));
          gatewayUpdated = true;
        }
        if (!gatewayUpdated) {
          dispatch(actions.updateGateway(updatedEntity));
        }
        if (message) {
          showGatewayStatusChangeMessage(dispatch, gatewayName, message);
        }
        if (running && updatedEntity.id === 'autogenerated') {
          let withAutoApiEndpodoint = false;
          if (!Object.keys(state.entities.apiEndpoints).includes('autogeneratedApiEndpoint')) {
            const {body} = await updatedEntity.adminApi.getApiEndpoints();
            if (!(body.api.paths.length === 1 && body.api.paths[0] === '*')) {
              const apiEndpoint = ApiEndpoint.create({
                id: 'autogeneratedApiEndpoint',
                name: 'api',
                itemOrder: 1000,
                ...body.api,
              });
              dispatch(actions.updateApiEndpoint(apiEndpoint));
              withAutoApiEndpodoint = true;
            }
          }
          if (withAutoApiEndpodoint && updatedEntity.pipelines[0].policies.length === 0) {
            try {
              const {body} = await updatedEntity.adminApi.getPipelines();
              const autogateway = Gateway.create(autogeneratedGatewayTemplate);
              autogateway.podName = 'autogenerated';
              autogateway.pipelines[0].policies = body.api.policies
                .map(policy => Policy.create(policy));
              dispatch(actions.updateGateway(autogateway));
            } catch (e) {}
          }
        }
      }
    }
  });
  if (Object.keys(entries).length === 0) {
    userStorage.remove('gateway');
  }
  if (isSave) {
    await dispatch(coreActions.saveToServer({showMessage: false}));
  }
  unlockAdminApi.forEach(id => dispatch(actions.unlockGatewayAdminApi(id)));
};
