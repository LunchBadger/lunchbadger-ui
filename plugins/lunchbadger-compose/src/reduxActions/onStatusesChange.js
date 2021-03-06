import React from 'react';
import {actions} from './actions';

const {
  utils: {coreActions, actions: actionsCore, userStorage},
  UI: {openDetailsPanelWithAutoscroll},
} = LunchBadgerCore;

const transformFunctions = (entities) => {
  const functions = {};
  Object.values(entities)
    .filter(({loaded}) => loaded)
    .forEach((function_) => {
      functions[function_.id] = function_;
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

const openDetailsPanel = (dispatch, entity, autoscrollSelector) => {
  dispatch(coreActions.setCurrentElement(entity));
  openDetailsPanelWithAutoscroll(entity.id, 'general', autoscrollSelector);
};

export const onSlsStatusChange = () => async (dispatch, getState) => {
  const {entitiesStatuses, entities: {functions: entities}} = getState();
  const statuses = entitiesStatuses['kubeless-fn'] || {};
  const functions = transformFunctions(entities);
  const entries = combineEntities(statuses, functions);
  let updatedEntity;
  let isSave = false;
  Object.keys(entries).forEach(async (slugId) => {
    const {status, entity, slug, pods} = entries[slugId];
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
      } else if (functionRunning){
        updatedEntity = entity.recreate();
        updatedEntity.running = null;
        dispatch(actions.updateFunction(updatedEntity));
      }
    } else {
      if (entity === null) {
        /* relict since deleting functions are not rendered */
        // const storageFunction = userStorage.getObjectKey('function', slugId) || {};
        // const fake = !storageFunction.name;
        // updatedEntity = Function_.create({
        //   ...storageFunction,
        //   name: slug,
        //   fake,
        //   deleting: true,
        //   running,
        //   itemOrder: 1000,
        // });
        // dispatch(actions.updateFunction(updatedEntity));
      } else {
        const {
          running: statusRunning,
          // deployment: {inProgress},
          failed,
        } = status;
        const pod = Object.keys(pods).find(key => pods[key].servesRequests);
        const running = statusRunning && !!pod; // statusRunning && !inProgress && !!pod;
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
              onClick: () => openDetailsPanel(dispatch, entity, '.FunctionCode')
            },
            {
              label: 'Show function logs',
              onClick: () => openDetailsPanel(dispatch, entity, '.FunctionLogs')
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
