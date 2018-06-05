import React from 'react';
import slug from 'slug';
import Config from '../../../../src/config';
import {actions} from './actions';
import Function_ from '../models/Function';

const envId = Config.get('envId');
const {getUser} = LunchBadgerCore.utils;
const {coreActions, actions: actionsCore} = LunchBadgerCore.utils;

const transformFunctionStatuses = (functionStatuses) => {
  const statuses = {};
  const projectSlug = `${getUser().profile.sub}-${envId}-`;
  Object.keys(functionStatuses).forEach((key) => {
    const slugArr = key.replace(`fn-${projectSlug}`, '').split('-');
    const slug = slugArr.slice(0, slugArr.length - 2).join('-');
    if (statuses[slug] && statuses[slug].status.running) return;
    statuses[slug] = functionStatuses[key];
  });
  return statuses;
};

const transformFunctions = (entities) => {
  const functions = {};
  Object.values(entities)
    .filter(({loaded}) => loaded)
    .forEach((function_) => {
      functions[slug(function_.name, {lower: true})] = function_;
    });
  return functions;
};

const combineEntities = (statuses, functions) => {
  const entries = {};
  Object.keys(statuses).forEach((name) => {
    entries[name] = statuses[name];
    if (functions[name]) {
      entries[name].entity = functions[name];
    } else {
      entries[name].entity = null;
    }
  });
  Object.keys(functions).forEach((name) => {
    if (entries[name]) {

    } else {
      entries[name] = {
        status: null,
        entity: functions[name],
      };
    }
  });
  return entries;
};

const showFunctionStatusChangeMessage = (dispatch, name, message) => {
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

export const onSlsStatusChange = () => async (dispatch, getState) => {
  const {entitiesStatuses, entities: {functions: entities}} = getState();
  const statuses = transformFunctionStatuses(entitiesStatuses['kubeless-fn'] || {});
  const functions = transformFunctions(entities);
  const entries = combineEntities(statuses, functions);
  let updatedEntity;
  let isSave = false;
  Object.keys(entries).forEach(async (slug) => {
    const {status, entity} = entries[slug];
    const {running: functionRunning, deleting: functionDeleting, name: functionName} = entity || {};
    if (status === null) {
      if (functionDeleting) {
        dispatch(actions.removeFunction(entity));
        localStorage.removeItem(`function-${slug}`);
      }
    } else {
      const {running} = status;
      if (entity === null) {
        const storageFunction = JSON.parse(localStorage.getItem(`function-${slug}`) || '{}');
        const fake = !storageFunction.name;
        updatedEntity = Function_.create({
          ...storageFunction,
          name: slug,
          fake,
          deleting: true,
          running,
          itemOrder: 1000,
        });
        dispatch(actions.updateFunction(updatedEntity));
      } else {
        if (running !== functionRunning) {
          if (functionRunning === null && !running) return;
          const isDeployed = functionRunning === null;
          if (isDeployed) {
            // isSave = true;
          }
          updatedEntity = entity.recreate();
          updatedEntity.running = running;
          dispatch(actions.updateFunction(updatedEntity));
          const message = isDeployed ? 'successfully deployed' : `is ${running ? '' : 'not'} running`;
          showFunctionStatusChangeMessage(dispatch, functionName, message);
        }
      }
    }
  });
  if (Object.keys(entries).length === 0) {
    Object.keys(localStorage).filter(key => key.startsWith('function-')).map(key => localStorage.removeItem(key));
  }
  if (isSave) {
    await dispatch(coreActions.saveToServer({showMessage: false}));
  }
};
