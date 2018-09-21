import {actions} from './actions';
import _ from 'lodash';
import {diff} from 'just-diff';
import {WorkspaceFilesService} from '../services';
import {getModelJsFilename} from '../utils';

const {coreActions} = LunchBadgerCore.utils;

export const reload = () => async (dispatch, getState) => {
  try {
    const {
      entities,
      states,
    } = getState();
    const {workspaceFiles} = entities;
    const {body} = await WorkspaceFilesService.load();
    const delta = diff(workspaceFiles, body);
    if (delta.length) {
      const {currentElement, zoom} = states;
      let zoomEditedSlug = '';
      if (!!zoom && !!currentElement) {
        const {id, type} = currentElement;
        zoomEditedSlug = getModelJsFilename((entities[type][id] || {}).name);
      }
      delta.forEach(({path}) => {
        if (path.length === 4
          && path[0] === 'files'
          && path[1] === 'server'
          && path[2] === 'models'
          && path[3].toLowerCase().endsWith('.js')
        ) {
          const entitySlug = path[3];
          if (zoomEditedSlug === entitySlug) {
            dispatch(coreActions.setCurrentZoom(undefined));
            dispatch(coreActions.setSilentReloadAlertVisible(true));
          }
        }
      });
    }
    return dispatch(actions.updateWorkspaceFiles(body));
  } catch (error) {
    return dispatch(coreActions.addSystemDefcon1({error}));
  }
};

export const update = (packageJson, modelJsFileName, modelJsFileContent = '') => async (dispatch, getState) => {
  const modelFile = {
    files: {
      server: {
        models: {
          [modelJsFileName]: modelJsFileContent
        }
      }
    }
  };
  if (packageJson) {
    modelFile.files['package.json'] = packageJson;
  }
  const workspaceFiles = _.merge(
    _.cloneDeep(getState().entities.workspaceFiles),
    modelFile
  );
  try {
    await WorkspaceFilesService.update(modelFile);
    return dispatch(actions.updateWorkspaceFiles(workspaceFiles));
  } catch (error) {
    return dispatch(coreActions.addSystemDefcon1({error}));
  }
};
