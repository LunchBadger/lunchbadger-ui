const handleFatals = LunchBadgerCore.utils.handleFatals;
const ProjectService = LunchBadgerCore.services.ProjectService;

export default (entity) => {
  if (entity.loaded) {
    let promise = ProjectService.deleteModel(entity.workspaceId).then(() => {
      return ProjectService.deleteModelConfig(entity.workspaceId);
    });
    handleFatals(promise);
  }
};
