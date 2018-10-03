import ProjectService from '../services/ProjectService';
import {actions} from '../reduxActions/actions';
import {createModelsFromJSON} from '../reduxActions/states';
import {setSilentLocks} from '../reduxActions/project';

export default [
  {
    request: ProjectService.load,
    callback: actions.onLoadProject,
    actions: [
      createModelsFromJSON,
      setSilentLocks,
    ],
  },
];
