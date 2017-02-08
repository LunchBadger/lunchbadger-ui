const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
const handleFatals = LunchBadgerCore.utils.handleFatals;

export default (service, entity) => {
  if (entity.loaded) {
    let promise = service.deleteModel(entity.workspaceId).then(() => {
      return service.deleteModelConfig(entity.workspaceId);
    });

    handleFatals(promise);
  }

  dispatch('RemoveEntity', {
    entity
  });
};
