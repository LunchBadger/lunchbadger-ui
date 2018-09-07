import React from 'react';
import slug from 'slug';
import Config from '../../../../src/config';
import {actions} from './actions';
import Function_ from '../models/Function';

const envId = Config.get('envId');
const {getUser} = LunchBadgerCore.utils;
const {coreActions, actions: actionsCore, userStorage} = LunchBadgerCore.utils;

const transformFunctionStatuses = (functionStatuses) => {
  const statuses = {};
  const projectSlug = `${getUser().profile.sub}-${envId}-`;
  Object.keys(functionStatuses).forEach((key) => {
    const slugArr = key.replace(`fn-${projectSlug}`, '').split('-');
    const slug = slugArr.slice(0, slugArr.length - 2).join('-');
    const {id} = functionStatuses[key];
    const slugId = `${id}-${slug}`;
    if (statuses[slugId] && statuses[slugId].status.running) return;
    statuses[slugId] = functionStatuses[key];
    statuses[slugId].slug = slug;
  });
  return statuses;
};

const transformFunctions = (entities) => {
  const functions = {};
  Object.values(entities)
    .filter(({loaded}) => loaded)
    .forEach((function_) => {
      const slugId = `${function_.id}-${slug(function_.name, {lower: true})}`;
      functions[slugId] = function_;
    });
  return functions;
};

const combineEntities = (statuses, functions) => {
  const entries = {};
  Object.keys(statuses).forEach((id) => {
    entries[id] = statuses[id];
    if (functions[id]) {
      entries[id].entity = functions[id];
    } else {
      entries[id].entity = null;
    }
  });
  Object.keys(functions).forEach((id) => {
    if (entries[id]) {

    } else {
      entries[id] = {
        status: null,
        entity: functions[id],
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
  Object.keys(entries).forEach(async (slugId) => {
    const {status, entity, slug} = entries[slugId];
    const {
      running: functionRunning,
      deleting: functionDeleting,
      name: functionName,
      error: functionError,
    } = entity || {};
    if (status === null) {
      if (functionDeleting) {
        dispatch(actions.removeFunction(entity));
        userStorage.removeObjectKey('function', slugId);
      }
    } else {
      const {running, failed} = status;
      if (entity === null) {
        const storageFunction = userStorage.getObjectKey('function', slugId) || {};
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
        updatedEntity = entity.recreate();
        let isEntityUpdate = false;
        if (running !== functionRunning) {
          if (functionDeleting) return;
          if (functionRunning === null && !running) return;
          const isDeployed = functionRunning === null;
          if (isDeployed) {
            // isSave = true;
          }
          isEntityUpdate = true;
          updatedEntity.running = running;
          if (running) {
            updatedEntity.error = null;
          }
          dispatch(actions.updateFunction(updatedEntity));
          const message = isDeployed ? 'successfully deployed' : `is ${running ? '' : 'not'} running`;
          showFunctionStatusChangeMessage(dispatch, functionName, message);
        }
        if (failed && !functionError) {
          isEntityUpdate = true;
          const error = new Error();
          error.friendlyTitle = (
            <div>
              {'Function'}
              {' '}
              <code>{updatedEntity.name}</code>
              {' '}
              {'failed to run'}
            </div>
          );
          error.friendlyMessage = (
            <div>
              {'Please check if the function code you provided is valid and correct.'}
              <br />
              {'You can also find more details in function logs.'}
            </div>
          );
          error.buttons = [
            {
              label: 'Close'
            },
            {
              label: 'Edit function code',
              onClick: () => updatedEntity.openDetailsPanel('general')('.FunctionCode')
            },
            {
              label: 'Show function logs',
              onClick: () => updatedEntity.openDetailsPanel('general')('.FunctionLogs')
            }
          ]
          updatedEntity.error = error;
        } else if (functionError && running) {
          isEntityUpdate = true;
          updatedEntity.error = undefined;
        }
        if (isEntityUpdate) {
          dispatch(actions.updateFunction(updatedEntity));
        }
      }
    }
  });
  if (Object.keys(entries).length === 0) {
    userStorage.remove('function');
  }
  if (isSave) {
    await dispatch(coreActions.saveToServer({showMessage: false}));
  }
};
