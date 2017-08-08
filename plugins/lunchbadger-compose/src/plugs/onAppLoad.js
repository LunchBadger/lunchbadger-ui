import {DataSourceService} from '../services';
import {ModelService} from '../services';
import {ModelConfigsService} from '../services';
import {actions} from '../reduxActions/actions';
import {addModelConfigsToConnections} from '../reduxActions/connections';

export default [
  {
    request: async () => await Promise.all([
      DataSourceService.load(),
      ModelService.load(),
      ModelConfigsService.load(),
    ]),
    callback: actions.onLoadCompose,
    action: addModelConfigsToConnections,
  }
  // {
  //   request: DataSourceService.load,
  //   callback: actions.onLoadDataSources,
  // },
  // {
  //   request: ModelService.load,
  //   callback: actions.onLoadModels,
  // },
  // {
  //   request: ModelConfigsService.load,
  //   callback: actions.onLoadModelConfigs,
  // },
];
