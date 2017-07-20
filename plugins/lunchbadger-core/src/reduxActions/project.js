import {actions} from './actions';
import ProjectService from '../services/ProjectService';

const load = () => async (dispatch, getState) => {
  getState().plugins.onAppLoad.forEach(func => dispatch(func()));
  dispatch(actions.loadProjectRequest());
  try {
    const data = await ProjectService.load();
    dispatch(actions.loadProjectSuccess(data));
  } catch (err) {
    dispatch(actions.loadProjectFailure(err));
  }
};

const save = () => (dispatch) => {

};

export default {
  load,
  save,
};
