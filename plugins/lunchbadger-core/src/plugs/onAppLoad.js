import ProjectService from '../services/ProjectService';
import {actions} from '../reduxActions/actions';
import {createModelsFromJSON} from '../reduxActions/states';

export default [
  {
    request: ProjectService.load,
    callback: actions.onLoadProject,
    action: createModelsFromJSON,
  },
];
