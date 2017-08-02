import {actions} from './actions';
import ProjectService from '../services/ProjectService';
import LoginManager from '../utils/auth';

export const loadFromServer = () => async (dispatch, getState) => {
  dispatch(actions.setLoadingProject(true));
  const {onAppLoad} = getState().plugins;
  try {
    const responses = await Promise.all(onAppLoad.map(item => item.request()));
    onAppLoad.map((item, idx) => dispatch(item.callback(responses[idx])));
  } catch (err) {
    console.error(err);
    dispatch(actions.addSystemDefcon1(err));
  }
  dispatch(actions.setLoadingProject(false));
};

export const saveToServer = () => async (dispatch, getState) => {
  dispatch(actions.setLoadingProject(true));
  const state = getState();
  const {onProjectSave} = state.plugins;
  const data = onProjectSave.reduce((map, item) => ({...map, ...item(state)}), {});
  try {
    await ProjectService.save(data);
  } catch (err) {
    console.error(err);
    dispatch(actions.addSystemDefcon1(err));
  }
  dispatch(actions.setLoadingProject(false));
};

export const clearServer = () => async (dispatch) => {
  dispatch(actions.clearProject());
  try {
    await ProjectService.clearProject();
  } catch (err) {
    if (err.statusCode === 401) {
      LoginManager().refreshLogin();
    }
  }
  dispatch(actions.setLoadingProject(false));
};
