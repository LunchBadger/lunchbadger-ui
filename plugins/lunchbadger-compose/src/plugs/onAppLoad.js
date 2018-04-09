import {
  DataSourceService,
  ModelService,
  ModelConfigsService,
  SLSService,
  WorkspaceFilesService,
} from '../services';
import {actions} from '../reduxActions/actions';
import {addModelConfigsToConnections} from '../reduxActions/connections';
import {removeNonExistentSubModels} from '../reduxActions/microservices';

export default [
  {
    request: async () => await Promise.all([
      DataSourceService.load(),
      ModelService.load(),
      ModelConfigsService.load(),
      SLSService.load(),
      WorkspaceFilesService.load(),
    ]),
    callback: actions.onLoadCompose,
    actions: [
      addModelConfigsToConnections,
      removeNonExistentSubModels,
    ],
  }
];
