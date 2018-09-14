import {
  DataSourceService,
  ModelService,
  ModelConfigsService,
  SLSService,
} from '../services';
import {actions} from '../reduxActions/actions';
import {addModelConfigsToConnections} from '../reduxActions/connections';
import {removeNonExistentSubModels} from '../reduxActions/microservices';
import {reload as workspaceFilesReload} from '../reduxActions/workspaceFiles';
import Model from '../models/Model';
export default [
  {
    request: async () => await Promise.all([
      DataSourceService.load(),
      ModelService.load(),
      ModelConfigsService.load(),
      SLSService.load(),
    ]),
    callback: actions.onLoadCompose,
    actions: [
      addModelConfigsToConnections,
      removeNonExistentSubModels,
      workspaceFilesReload,
    ],
    responses: responses => ({
      models: responses[1].body
        .reduce((map, item) => ({
          ...map,
          [item.lunchbadgerId]: Model.create(item).toJSON({isForServer: true}),
        }), {}),
    }),
  }
];
