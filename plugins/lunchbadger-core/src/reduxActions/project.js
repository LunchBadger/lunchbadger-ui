import {actions} from './actions';
import ProjectService from '../services/ProjectService';

export const loadFromServer = () => async (dispatch, getState) => {
  // getState().plugins.onAppLoad.forEach(func => dispatch(func()));
  const {onAppLoad} = getState().plugins;
  try {
    const responses = await Promise.all(onAppLoad.map(item => item.request()));
    onAppLoad.map((item, idx) => dispatch(item.callback(responses[idx])));
  } catch (err) {
    // console.log(999, err);
  }
};

export const saveToServer = () => (dispatch) => {
  console.log('saveToServer');
};

export const clearServer = () => (dispatch) => {
  console.log('clearServer');
};
