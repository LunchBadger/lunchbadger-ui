import {
  DataSourceService,
  ModelService,
  ModelConfigsService,
  SLSService,
} from '../services';
import {actions} from '../reduxActions/actions';
import {addModelConfigsToConnections} from '../reduxActions/connections';
import {removeNonExistentSubModels} from '../reduxActions/microservices';
import {loadFunctionServices} from '../reduxActions/functions';

export default [
  {
    request: async () => await Promise.all([
      DataSourceService.load(),
      ModelService.load(),
      ModelConfigsService.load(),
      SLSService.list(),
    ]),
    callback: actions.onLoadCompose,
    actions: [
      addModelConfigsToConnections,
      removeNonExistentSubModels,
      loadFunctionServices,
    ],
  }
];
