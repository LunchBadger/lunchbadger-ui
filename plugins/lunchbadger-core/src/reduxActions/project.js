import {actions} from './actions';
import {addSystemDefcon1} from './systemDefcon1';
import ProjectService from '../services/ProjectService';
import LoginManager from '../utils/auth';

export const loadFromServer = () => async (dispatch, getState) => {
  dispatch(actions.setLoadingProject(true));
  const {onAppLoad} = getState().plugins;
  try {
    const responses = await Promise.all(onAppLoad.map(item => item.request()));
    onAppLoad.map((item, idx) => dispatch(item.callback(responses[idx])));
    onAppLoad.map((item, idx) => {
      item.action && dispatch(item.action(responses[idx]));
      item.actions && item.actions.map(action => dispatch(action(responses[idx])));
    });
  } catch (err) {
    if (err.statusCode === 401) {
      LoginManager().refreshLogin();
    } else {
      dispatch(addSystemDefcon1(err));
    }
  }
  dispatch(actions.setLoadingProject(false));
};

export const saveToServer = () => async (dispatch, getState) => {
  dispatch(actions.setLoadingProject(true));
  const state = getState();
  const {onProjectSave, onBeforeProjectSave} = state.plugins;
  const onSaves = onBeforeProjectSave.reduce((map, item) => [...map, ...item(state)], []);
  if (onSaves.length > 0) {
    try {
      await Promise.all(onSaves.map(item => item.onSave(state)));
    } catch (err) {
      dispatch(addSystemDefcon1(err));
    }
  }
  const data = onProjectSave.reduce((map, item) => ({...map, ...item(state)}), {});
  try {
    await ProjectService.save(data);
  } catch (err) {
    if (err.statusCode === 401) {
      LoginManager().refreshLogin();
    } else {
      dispatch(addSystemDefcon1(err));
    }
  }
  dispatch(actions.addSystemInformationMessage({
    type: 'success',
    message: 'All data has been synced with API',
  }));
  dispatch(actions.setLoadingProject(false));
};

export const clearServer = () => async (dispatch) => {
  dispatch(actions.clearProject());
  try {
    await ProjectService.clearProject();
  } catch (err) {
    if (err.statusCode === 401) {
      LoginManager().refreshLogin();
    } else {
      dispatch(addSystemDefcon1(err));
    }
  }
  dispatch(actions.addSystemInformationMessage({
    type: 'success',
    message: 'All data removed from server',
  }));
  dispatch(actions.setLoadingProject(false));
};

export const saveOrder = orderedIds => (dispatch, getState) => {
  getState().plugins.onSaveOrder.forEach(action => dispatch(action(orderedIds)));
};

export const logout = () => () => {
  LoginManager().logout();
};
