const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
const ProjectService = LunchBadgerCore.services.ProjectService;

export default (entity) => {
  let service = new ProjectService(
    global.LUNCHBADGER_CONFIG.projectApiUrl,
    global.LUNCHBADGER_CONFIG.workspaceApiUrl,
    global.loginManager.user.id_token);

  service.deleteModel(entity.workspaceId).then(() => {
    return service.deleteModelConfig(entity.workspaceId);
  });

  dispatch('RemoveEntity', {
    entity
  });
};
