import {diff} from 'just-diff';
import _ from 'lodash';
import {actions} from './actions';
import {setPendingEdit} from './states';
import {addSystemDefcon1} from './systemDefcon1';
import ProjectService from '../services/ProjectService';
import LoginManager from '../utils/auth';
import userStorage from '../utils/userStorage';
import {updateEntitiesStatues} from './';
import Connections from '../stores/Connections';
import {GAEvent} from '../ui';
import {
  clearCurrentEditElement,
  setCurrentZoom,
  setSilentReloadAlertVisible,
} from './states';

let prevData;

export const loadFromServer = () => async (dispatch, getState) => {
  dispatch(actions.setLoadingProject(true));
  dispatch(actions.setLoadedProject(false));
  const {onAppLoad, onProjectSave} = getState().plugins;
  try {
    const responses = await Promise.all([
      ...onAppLoad.map(item => item.request()),
      // new Promise(res => setTimeout(res, 300)),
    ]);
    onAppLoad.map((item, idx) => dispatch(item.callback(responses[idx])));
    onAppLoad.map((item, idx) => {
      item.action && dispatch(item.action(responses[idx]));
      item.actions && item.actions.map(action => dispatch(action(responses[idx])));
    });
    const connections = responses[0].body.connections
      .map(({fromId, toId}) => ({fromId, toId}))
      .reduce((map, item) => {
        if (!map[item.fromId]) {
          map[item.fromId] = {};
        }
        if (!map[item.fromId][item.toId]) {
          map[item.fromId][item.toId] = true;
        }
        return map;
      }, {});
    prevData = {
      ...onProjectSave.reduce((map, item) => ({...map, ...item(getState(), {isForDiff: true, connections})}), {}),
      connections,
    };
    // console.log('INIT prevData', prevData);
  } catch (error) {
    if (error.statusCode === 401) {
      LoginManager().refreshLogin();
    } else {
      dispatch(addSystemDefcon1({error}));
    }
  }
  dispatch(actions.setLoadingProject(false));
  dispatch(actions.setLoadedProject(true));
  dispatch(updateEntitiesStatues());
};

export const saveToServer = (opts) => async (dispatch, getState) => {
  dispatch(actions.setLoadingProject(true));
  const options = Object.assign({
    showMessage: true, // relict since #774
    saveProject: true,
    manualSave: false,
  }, opts);
  const {saveProject, manualSave} = options;
  const state = getState();
  const {onProjectSave, onBeforeProjectSave} = state.plugins;
  const currData = onProjectSave.reduce((map, item) => ({
    ...map,
    ...item(state, {...options, isForDiff: true}),
  }), {});
  const data = onProjectSave.reduce((map, item) => ({...map, ...item(state, options)}), {});
  const delta = diff(prevData, currData);
  // if (delta.length === 0) {
  //   console.log('NO CHANGE', delta, currData, prevData);
  //   setTimeout(() => {
  //     dispatch(actions.setLoadingProject(false));
  //   }, 100);
  //   return;
  // }
  const onSaves = onBeforeProjectSave.reduce((map, item) => [...map, ...item(state)], []);
  try {
    await Promise.all([
      ...onSaves.map(item => item.onSave(state, delta, currData, prevData)),
      saveProject ? ProjectService.save(data) : undefined,
      // new Promise(res => setTimeout(res, 300)),
    ]);
    prevData = _.cloneDeep(currData);
  } catch (error) {
    if (error.statusCode === 401) {
      LoginManager().refreshLogin();
    } else {
      dispatch(addSystemDefcon1({error}));
    }
  }
  dispatch(actions.setLoadingProject(false));
  if (manualSave) {
    GAEvent('Header Menu', 'Saved Project');
  }
};

export const clearServer = () => async (dispatch, getState) => {
  const state = getState();
  const {onProjectClear, onProjectSave} = state.plugins;
  dispatch(actions.clearProject());
  userStorage.remove('zoomWindow');
  userStorage.remove('entityCollapsed');
  userStorage.remove('FilesEditorSize');
  userStorage.remove('ResizableWrapperSize');
  userStorage.remove('CollapsibleExpanded');
  try {
    await ProjectService.clearProject();
    if (onProjectClear.length > 0) {
      try {
        await Promise.all(onProjectClear.map(action => dispatch(action())));
      } catch (error) {
        dispatch(addSystemDefcon1({error}));
      }
    }
  } catch (error) {
    if (error.statusCode === 401) {
      LoginManager().refreshLogin();
    } else {
      dispatch(addSystemDefcon1({error}));
    }
  }
  prevData = onProjectSave.reduce((map, item) => ({
    ...map,
    ...item(state, {isForDiff: true}),
  }), {});
  dispatch(actions.addSystemInformationMessage({
    type: 'success',
    message: 'All data removed from server',
  }));
  // await new Promise(res => setTimeout(res, 300));
  dispatch(actions.setLoadingProject(false));
  GAEvent('Header Menu', 'Cleared Project');
  window.dispatchEvent(new Event('ReloadApiExplorer'));
};

export const saveOrder = orderedIds => (dispatch, getState) => {
  getState().plugins.onSaveOrder.forEach(action => dispatch(action(orderedIds)));
};

export const logout = () => () => {
  GAEvent('Header Menu', 'Logged Out');
  LoginManager().logout();
};

export const silentReload = paper => async (dispatch, getState) => {
  const state = getState();
  const {
    plugins: {
      onAppLoad,
      processProjectLoad,
      onProjectSave,
    },
    entities: {
      dataSources,
      models,
      modelsBundled,
      microservices,
      functions,
      gateways,
      serviceEndpoints,
      apiEndpoints,
      apis,
      portals,
    },
    states,
  } = state;
  try {
    const connections = Connections
      .search({})
      .filter(({fromId, toId}) => !fromId.startsWith('autogenerated') && !toId.startsWith('autogenerated'))
      .filter(({info}) => {
        try {
          const wip = !info.connection || info.connection.hasType('wip');
          return !wip;
        } catch (e) {
          return false;
        }
      })
      .map(({fromId, toId}) => `${fromId}:${toId}`)
      .reduce((map, item) => ({...map, [item]: true}), {});
    const pendingEdit = states.pendingEdit || {};
    const currentEditElement = states.currentEditElement || {};
    const canvasEditedId = currentEditElement.id;
    const canvasEditedType = (currentEditElement.constructor || {}).type;
    const zoomEditedId = !!states.zoom && (states.currentElement || {}).id;
    const endpoints = {
      dataSources,
      models,
      modelsBundled,
      microservices,
      functions,
      gateways,
      serviceEndpoints,
      apiEndpoints,
      apis,
      portals,
    };
    const prevResponse = Object.keys(endpoints)
      .reduce((map, key) => {
        if (!endpoints[key]) return map;
        return {
          ...map,
          [key]: Object.values(endpoints[key])
            .filter(({id, loaded}) => !id.startsWith('autogenerated') && loaded)
            .reduce((arr, item) => {
              const entity = item.toJSON({isForServer: true});
              Object.keys(entity).forEach((prop) => {
                if (entity[prop] === undefined) {
                  delete entity[prop];
                }
                if (key === 'dataSources') { // FIXME quick and dirty, error should not be in toJSON
                  delete entity.error;
                }
              });
              return {
                ...arr,
                [item.id]: entity,
              }
            }, {}),
        }
      }, {});
    prevResponse.connections = connections;
    prevResponse.pendingEdit = pendingEdit;
    const responses = await Promise.all([
      ...onAppLoad.map(item => item.request()),
      // new Promise(res => setTimeout(res, 300)),
    ]);
    const currResponse = processProjectLoad
      .reduce((map, item) => ({
        ...map,
        ...item(responses),
        }), {});
    const delta = diff(prevResponse, currResponse);
    // console.log({delta, prevResponse, currResponse});
    const operations = {};
    const connectionOperations = {
      add: [],
      remove: [],
    };
    delta.forEach((item) => {
      const [entityType, entityId] = item.path;
      if (entityType === 'connections') {
        const [fromId, toId] = entityId.split(':');
        connectionOperations[item.op].push({fromId, toId});
      } else if (entityType === 'pendingEdit') {
        dispatch(setPendingEdit(item.op, entityId, true, false, currResponse.pendingEdit));
      } else {
        const operation = item.path.length === 2 && item.op === 'remove'
          ? 'silentEntityRemove'
          : 'silentEntityUpdate';
        operations[entityId] = {
          operation,
          entityType,
          entityId,
          entityData: currResponse[entityType][entityId],
        };
      }
    });
    Object.values(operations).forEach((payload) => {
      const {
        operation,
        entityType,
        entityId,
      } = payload;
      // console.log(operation, entityType, entityId);
      dispatch(actions[operation](payload));
      let isCanvasEdited = !!entityId && canvasEditedId === entityId;
      if (entityType === 'modelsBundled'
        && canvasEditedType === 'Microservice'
        && prevResponse.microservices[canvasEditedId].models.includes(entityId)
      ) {
        isCanvasEdited = true;
      }
      const isZoomEdited = !!entityId && zoomEditedId === entityId;
      if (isCanvasEdited || isZoomEdited) {
        if (isCanvasEdited) {
          dispatch(clearCurrentEditElement());
        }
        if (isZoomEdited) {
          dispatch(setCurrentZoom(undefined));
        }
        dispatch(setSilentReloadAlertVisible(true));
      }
    });
    connectionOperations.add.forEach(({fromId, toId}) => {
      const portOut = document.getElementById(`port_out_${fromId}`);
      let portIn = document.getElementById(`port_in_${toId}`);
      if (functions[fromId] && models[toId]) {
        portIn = document.getElementById(`port_out_${toId}`);
      }
      if (portOut && portIn) {
        paper.connect({
          source: portOut.querySelector('.port__anchor'),
          target: portIn.querySelector('.port__anchor'),
          parameters: {
            existing: 1,
          },
        },
        );
      }
    });
    connectionOperations.remove.forEach(({fromId, toId}) => {
      const connToDetach = Connections.find({fromId, toId});
      if (connToDetach) {
        try {
          paper.detach(connToDetach.info.connection, {
            fireEvent: false,
            forceDetach: false,
          });
        } catch (e) {}
        Connections.removeConnection(fromId, toId);
      }
    });
    onAppLoad.map(item => item.onWsGitChange && dispatch(item.onWsGitChange()));
    const conns = responses[0].body.connections
      .map(({fromId, toId}) => ({fromId, toId}))
      .reduce((map, item) => {
        if (!map[item.fromId]) {
          map[item.fromId] = {};
        }
        if (!map[item.fromId][item.toId]) {
          map[item.fromId][item.toId] = true;
        }
        return map;
      }, {});
    prevData = {
      ...onProjectSave.reduce((map, item) => ({
        ...map,
        ...item(getState(), {isForDiff: true, connections: conns}),
      }), {}),
      connections: conns,
    };
  } catch (error) {
    if (error.statusCode === 401) {
      LoginManager().refreshLogin();
    } else {
      dispatch(addSystemDefcon1({error}));
    }
  }
};

export const setSilentLocks = () => (dispatch, getState) => {
  const {pendingEdit = {}} = getState().states;
  Object.keys(pendingEdit)
    .forEach(entityId => dispatch(setPendingEdit('add', entityId)));
};
