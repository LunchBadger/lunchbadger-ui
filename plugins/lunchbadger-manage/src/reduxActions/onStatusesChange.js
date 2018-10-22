import React from 'react';
import {actions} from './actions';
import Gateway from '../models/Gateway';
import Pipeline from '../models/Pipeline';

const {coreActions, actions: actionsCore, userStorage} = LunchBadgerCore.utils;

const transformGateways = (entities) => {
  const gateways = {};
  Object.values(entities)
    .filter(({loaded}) => loaded)
    .forEach((gateway) => {
      gateways[gateway.id] = gateway;
    });
  return gateways;
};

const combineEntities = (statuses, gateways) => {
  const entries = {};
  Object.keys(statuses).forEach((id) => {
    entries[id] = statuses[id];
    if (gateways[id]) {
      entries[id].entity = gateways[id];
    } else {
      entries[id].entity = null;
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
  const {entitiesStatuses, entities: {gateways: entities}} = getState();
  const statuses = entitiesStatuses.gateway || {};
  const gateways = transformGateways(entities);
  const entries = combineEntities(statuses, gateways);
  let updatedEntity;
  let isSave = false;
  let unlockAdminApi = [];
  Object.keys(entries).forEach(async (slugId) => {
    const {status, entity, slug} = entries[slugId];
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
      const {running} = status;
      if (entity === null) {
        const storageGateway = userStorage.getObjectKey('gateway', slugId) || {};
        const fake = !storageGateway.name;
        updatedEntity = Gateway.create({
          ...storageGateway,
          name: slug,
          fake,
          deleting: true,
          running,
          itemOrder: 1000,
        });
        dispatch(actions.updateGateway(updatedEntity));
      } else {
        updatedEntity = entity.recreate();
        updatedEntity.pipelinesLunchbadger = entity.pipelinesLunchbadger;
        let message;
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
          message = 'successfully deployed';
        }
        if (running !== gatewayRunning) {
          if (gatewayDeleting) return;
          if (!running && gatewayRunning === null) return;
          updatedEntity.running = running;
          if (!running && gatewayRunning && hasPipelinesLunchbadger) {
            updatedEntity.running = null;
          } else if (!message) {
            message = `is ${running ? '' : 'not'} running`;
          }
          dispatch(actions.updateGateway(updatedEntity));
        }
        if (message) {
          showGatewayStatusChangeMessage(dispatch, gatewayName, message);
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
