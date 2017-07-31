import ProjectService from '../services/ProjectService';
import {actions} from '../reduxActions/actions';

export default [
  {
    request: ProjectService.load,
    callback: actions.onLoadProject,
  },
];
