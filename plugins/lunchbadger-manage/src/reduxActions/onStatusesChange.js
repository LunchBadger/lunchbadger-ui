import React from 'react';
import slug from 'slug';
import Config from '../../../../src/config';
import {actions} from './actions';
import Gateway from '../models/Gateway';

const envId = Config.get('envId');
const {getUser} = LunchBadgerCore.utils;
const {coreActions, actions: actionsCore, userStorage} = LunchBadgerCore.utils;

const transformGatewayStatuses = (gatewayStatuses) => {
  const statuses = {};
  const projectSlug = `${getUser().profile.sub}-${envId}-`;
  Object.keys(gatewayStatuses).forEach((key) => {
    const slugArr = key.replace(`gateway-${projectSlug}`, '').split('-');
    const slug = slugArr.slice(0, slugArr.length - 2).join('-');
    if (statuses[slug] && statuses[slug].status.running) return;
    statuses[slug] = gatewayStatuses[key];
  });
  return statuses;
};

const transformGateways = (entities) => {
  const gateways = {};
  Object.values(entities)
    .filter(({loaded}) => loaded)
    .forEach((gateway) => {
      gateways[slug(gateway.name, {lower: true})] = gateway;
    });
  return gateways;
};

const combineEntities = (statuses, gateways) => {
  const entries = {};
  Object.keys(statuses).forEach((name) => {
    entries[name] = statuses[name];
    if (gateways[name]) {
      entries[name].entity = gateways[name];
      entries[name].action = '';
    } else {
      entries[name].entity = null;
      entries[name].action = 'new';
    }
  });
  Object.keys(gateways).forEach((name) => {
    if (entries[name]) {

    } else {
      entries[name] = {
        status: null,
        entity: gateways[name],
      };
      entries[name].action = 'new2';
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
  Object.keys(entries).forEach(async (slug) => {
    const {status, entity} = entries[slug];
    const {running: gatewayRunning, deleting: gatewayDeleting, name: gatewayName} = entity || {};
    if (status === null) {
      if (gatewayDeleting) {
        dispatch(actions.removeGateway(entity));
        userStorage.removeObjectKey('gateway', slug);
      }
    } else {
      const {running} = status;
      if (entity === null) {
        const storageGateway = userStorage.getObjectKey('gateway', slug) || {};
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
