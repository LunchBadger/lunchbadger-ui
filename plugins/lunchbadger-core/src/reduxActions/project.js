import {actions} from './actions';
import ProjectService from '../services/ProjectService';

export const loadFromServer = () => async (dispatch, getState) => {
  getState().plugins.onAppLoad.forEach(func => dispatch(func()));
};

export const saveToServer = () => (dispatch) => {

};

export const loadProject = () => async (dispatch) => {
  dispatch(actions.loadProjectRequest());
  try {
    const data = await ProjectService.load();
    dispatch(actions.loadProjectSuccess(data));
  } catch (err) {
    console.log('ERROR loadProjectFailure', err);
    dispatch(actions.loadProjectFailure(err));
  }
}
