import {actions} from './actions';
import _ from 'lodash';
import {WorkspaceFilesService} from '../services';

const {coreActions} = LunchBadgerCore.utils;

export const reload = () => async (dispatch) => {
  try {
    const {body} = await WorkspaceFilesService.load();
    return dispatch(actions.updateWorkspaceFiles(body));
  } catch (err) {
    return dispatch(coreActions.addSystemDefcon1(err));
  }
};

export const update = (name, content) => async (dispatch, getState) => {
  const workspaceFiles = _.cloneDeep(getState().entities.workspaceFiles);
  workspaceFiles.files.server.models[name] = content;
  try {
    await WorkspaceFilesService.update(workspaceFiles);
    return dispatch(actions.updateWorkspaceFiles(workspaceFiles));
  } catch (err) {
    return dispatch(coreActions.addSystemDefcon1(err));
  }
};