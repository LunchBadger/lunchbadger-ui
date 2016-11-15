const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (service, entity) => {
  service.deleteModel(entity.workspaceId).then(() => {
    return service.deleteModelConfig(entity.workspaceId);
  });

  dispatch('RemoveEntity', {
    entity
  });
};
