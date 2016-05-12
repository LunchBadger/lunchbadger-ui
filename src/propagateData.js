console.info('Pre-fetching projects data...');

const ProjectService = LunchBadgerCore.services.ProjectService;
const projectData = ProjectService.getAll();

projectData.then((response) => {
  if (Array.isArray(response.body)) {
    // right now, just load first available project

    const data = response.body[0];

    if (LunchBadgerManage) {
      LunchBadgerManage.actions.Stores.Public.initialize(data);
      LunchBadgerManage.actions.Stores.Private.initialize(data);
      LunchBadgerManage.actions.Stores.Gateway.initialize(data);
    }

    if (LunchBadgerCompose) {
      LunchBadgerCompose.actions.Stores.Private.initialize(data);
      LunchBadgerCompose.actions.Stores.Backend.initialize(data);
    }

    if (LunchBadgerMonetize) {
      LunchBadgerMonetize.actions.Stores.Public.initialize(data);
    }
  }
});
