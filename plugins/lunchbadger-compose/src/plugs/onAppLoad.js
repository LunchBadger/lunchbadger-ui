import {DataSourceService} from '../services';
import {ModelService} from '../services';
import {ModelConfigsService} from '../services';
import {actions} from '../reduxActions/actions';

export default [
  {
    request: DataSourceService.load,
    callback: actions.onLoadDataSources,
  },
  {
    request: ModelService.load,
    callback: actions.onLoadModels,
  },
  {
    request: ModelConfigsService.load,
    callback: actions.onLoadModelConfigs,
  },
];
