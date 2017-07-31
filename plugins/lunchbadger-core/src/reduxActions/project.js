import {actions} from './actions';
import ProjectService from '../services/ProjectService';

export const loadFromServer = () => async (dispatch, getState) => {
  dispatch(actions.setLoadingProject(true));
  const {onAppLoad} = getState().plugins;
  try {
    const responses = await Promise.all(onAppLoad.map(item => item.request()));
    onAppLoad.map((item, idx) => dispatch(item.callback(responses[idx])));
  } catch (err) {
    dispatch(actions.addSystemDefcon1(err));
  }
  dispatch(actions.setLoadingProject(false));
};

export const saveToServer = () => (dispatch) => {
  console.log('saveToServer');
};

export const clearServer = () => (dispatch) => {
  console.log('clearServer');
};
