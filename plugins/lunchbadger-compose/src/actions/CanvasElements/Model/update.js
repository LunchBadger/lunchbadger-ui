import _ from 'lodash';

const {dispatchAsync} = LunchBadgerCore.dispatcher.AppDispatcher;
const ProjectService = LunchBadgerCore.services.ProjectService;
const Private = LunchBadgerManage.stores.Private;

export default (id, props) => {
  let service = new ProjectService(
    global.LUNCHBADGER_CONFIG.projectApiUrl,
    global.LUNCHBADGER_CONFIG.workspaceApiUrl,
    global.loginManager.user.id_token);

  let entity = Private.findEntity(id);

  dispatchAsync(service.putModel(_.merge(entity, props)), {
    request: 'UpdateModelStart',
    success: 'UpdateModelEnd',
    failure: 'UpdateModelEnd'
  }, {
    id: id,
    data: props
  });
};
