console.info('Pre-fetching projects data...');

const ProjectService = LunchBadgerCore.services.ProjectService;
const projectData = ProjectService.getAll();

const initializePublic = LunchBadgerManage.actions.Stores.Public.initialize;
const initializePrivateWithEndpoints = LunchBadgerManage.actions.Stores.Private.initialize;
const initializePrivateWithModels = LunchBadgerCompose.actions.Stores.Private.initialize;
const initializeGateway = LunchBadgerManage.actions.Stores.Gateway.initialize;
const initializeBackend = LunchBadgerCompose.actions.Stores.Backend.initialize;

projectData.then((response) => {
  if (Array.isArray(response.body)) {
    // right now, just load first available project

    const data = response.body[0];

    initializeBackend(data);
    initializePrivateWithEndpoints(data);
    initializePrivateWithModels(data);
    initializeGateway(data);
    initializePublic(data);
  }
});
