import {diff} from 'just-diff';
import {actions} from './actions';
import {addSystemDefcon1} from './systemDefcon1';
import ProjectService from '../services/ProjectService';
import LoginManager from '../utils/auth';
import userStorage from '../utils/userStorage';
import {updateEntitiesStatues} from './';
import {GAEvent} from '../../../lunchbadger-ui/src';

let prevData;

export const loadFromServer = () => async (dispatch, getState) => {
  dispatch(actions.setLoadingProject(true));
  dispatch(actions.setLoadedProject(false));
  const {onAppLoad, onProjectSave} = getState().plugins;
  try {
    const responses = await Promise.all(onAppLoad.map(item => item.request()));
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
    ]);
    prevData = currData;
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
  dispatch(actions.setLoadingProject(false));
  GAEvent('Header Menu', 'Cleared Project');
};

export const saveOrder = orderedIds => (dispatch, getState) => {
  getState().plugins.onSaveOrder.forEach(action => dispatch(action(orderedIds)));
};

export const logout = () => () => {
  GAEvent('Header Menu', 'Logged Out');
  LoginManager().logout();
};
