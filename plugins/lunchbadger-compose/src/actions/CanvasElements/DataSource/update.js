import _ from 'lodash';
import BackendStore from '../../../stores/Backend';

const {dispatchAsync} = LunchBadgerCore.dispatcher.AppDispatcher;
const ProjectService = LunchBadgerCore.services.ProjectService;

export default (id, props) => {
  let service = new ProjectService(
    global.LUNCHBADGER_CONFIG.projectApiUrl,
    global.LUNCHBADGER_CONFIG.workspaceApiUrl,
    global.loginManager.user.id_token);

  let dataSource = BackendStore.findEntity(id);

  dispatchAsync(service.putDataSource(_.merge(dataSource, props)), {
    request: 'UpdateDataSourceStart',
    success: 'UpdateDataSourceEnd',
    failure: 'UpdateDataSourceEnd'
  }, {
    id: id,
    data: props
  });
};
