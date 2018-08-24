import React from 'react';
import slug from 'slug';
import Config from '../../../../src/config';
import {actions} from './actions';
import Gateway from '../models/Gateway';
import Pipeline from '../models/Pipeline';

const envId = Config.get('envId');
const {getUser} = LunchBadgerCore.utils;
const {coreActions, actions: actionsCore, userStorage} = LunchBadgerCore.utils;

const transformGatewayStatuses = (gatewayStatuses) => {
  const statuses = {};
  const projectSlug = `${getUser().profile.sub}-${envId}-`;
  Object.keys(gatewayStatuses).forEach((key) => {
    const slugArr = key.replace(`gateway-${projectSlug}`, '').split('-');
    const slug = slugArr.slice(0, slugArr.length - 2).join('-');
    const {id} = gatewayStatuses[key];
    const slugId = `${id}-${slug}`;
    if (statuses[slugId] && statuses[slugId].status.running) return;
    statuses[slugId] = gatewayStatuses[key];
    statuses[slugId].slug = slug;
  });
  return statuses;
};

const transformGateways = (entities) => {
  const gateways = {};
  Object.values(entities)
    .filter(({loaded}) => loaded)
    .forEach((gateway) => {
      const slugId = `${gateway.id}-${slug(gateway.name, {lower: true})}`;
      gateways[slugId] = gateway;
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
  const statuses = transformGatewayStatuses(entitiesStatuses.gateway || {});
  const gateways = transformGateways(entities);
  const entries = combineEntities(statuses, gateways);
  let updatedEntity;
  let isSave = false;
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
      } else if (typeof entity.pipelinesLunchbadger === 'object') {
        updatedEntity = entity.recreate();
        updatedEntity.pipelines = entity.pipelinesLunchbadger.map(p => Pipeline.create(p));
        updatedEntity.pipelinesLunchbadger = undefined;
        updatedEntity.running = null;
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
        if (running !== gatewayRunning) {
          if (gatewayDeleting) return;
          if (gatewayRunning === null && !running) return;
          const isDeployed = gatewayRunning === null;
          if (isDeployed) {
            isSave = true;
          }
          updatedEntity = entity.recreate();
          updatedEntity.running = running;
          if (running && typeof entity.pipelinesLunchbadger === 'object') {
            updatedEntity.pipelines = entity.pipelinesLunchbadger.map(p => Pipeline.create(p));
            updatedEntity.pipelinesLunchbadger = undefined;
          }
          dispatch(actions.updateGateway(updatedEntity));
          const message = isDeployed ? 'successfully deployed' : `is ${running ? '' : 'not'} running`;
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
};
