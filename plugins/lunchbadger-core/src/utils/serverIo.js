/*eslint no-console:0 */
import AppState from '../stores/AppState';
import Connection from '../stores/Connection';
import ProjectService from '../services/ProjectService';
import setProjectRevision from '../actions/Stores/AppState/setProjectRevision';
import {waitForStores} from '../utils/waitForStores';

const EMPTY_PROJECT = {
  connections: [],
  states: [],
  privateEndpoints: [],
  gateways: [],
  publicEndpoints: [],
  apis: [],
  portals: []
};

export function loadFromServer(config, loginManager) {
  console.info('Pre-fetching projects data...', config);

  const user = loginManager.user;
  const projectService = new ProjectService(
    config.projectApiUrl, config.workspaceApiUrl, user.id_token);
  const projectData = projectService
    .get(user.profile.sub, config.envId)
    .catch(err => {
      switch (err.statusCode) {
        case 404:
          return {
            body: EMPTY_PROJECT,
            response: {
              headers: {}
            }
          };
        case 401:
          loginManager.refreshLogin();
          throw err;
        default:
          throw err;
      }
    });

  let storesList = [];

  if (LunchBadgerManage) {
    storesList.push(
      LunchBadgerManage.stores.Private,
      LunchBadgerManage.stores.Gateway,
      LunchBadgerManage.stores.Public
    );
  }

  if (LunchBadgerCompose) {
    storesList.push(
      LunchBadgerCompose.stores.Backend
    );
  }

  return projectData.then(res => {
    const project = res[0].body[0] || EMPTY_PROJECT;
    const models = res[1].body;
    const dataSources = res[2].body;

    //const rev = res.response.headers['etag'];
    //setProjectRevision(rev);

    let result = waitForStores(storesList).then(() => {
      // attach connections ;-)
      project.connections.forEach((connection) => {
        if (document.getElementById(`port_out_${connection.fromId}`) && document.getElementById(`port_in_${connection.toId}`)) {
          setTimeout(() => LunchBadgerCore.utils.paper.connect({
            source: document.getElementById(`port_out_${connection.fromId}`).querySelector('.port__anchor'),
            target: document.getElementById(`port_in_${connection.toId}`).querySelector('.port__anchor'),
            parameters: {
              existing: 1
            }
          }));
        }
      });

      setTimeout(() => {
        LunchBadgerCore.actions.Stores.AppState.initialize(project.states);
      });
    });

    if (LunchBadgerManage) {
      LunchBadgerManage.actions.Stores.Public.initialize(project);
      LunchBadgerManage.actions.Stores.Private.initialize(project);
      LunchBadgerManage.actions.Stores.Gateway.initialize(project);
    }

    if (LunchBadgerCompose) {
      LunchBadgerCompose.actions.Stores.Private.initialize(models);
      LunchBadgerCompose.actions.Stores.Backend.initialize(dataSources);
    }

    if (LunchBadgerMonetize) {
      LunchBadgerMonetize.actions.Stores.Public.initialize(project);
    }

    return result;
  });
}

export function saveToServer(config, loginManager) {
  const user = loginManager.user;

  let storesList = [
    Connection
  ];

  const saveableServices = [];

  const project = {
    connections: [],
    states: []
  };

  if (LunchBadgerManage) {
    storesList.push(
      LunchBadgerManage.stores.Private,
      LunchBadgerManage.stores.Gateway,
      LunchBadgerManage.stores.Public
    );

    project.privateEndpoints = [];
    project.gateways = [];
    project.publicEndpoints = [];
  }

  if (LunchBadgerCompose) {
    storesList.push(
      LunchBadgerCompose.stores.Backend
    );

    project.dataSources = [];
    project.privateModels = [];
  }

  if (LunchBadgerMonetize) {
    project.apis = [];
    project.portals = [];
  }

  storesList.forEach((store) => {
    const entities = store.getData();

    entities.forEach((entity) => {
      switch (entity.constructor.type) {
        case 'Connection':
          project.connections.push(entity.toJSON());
          break;
        case 'DataSource':
          project.dataSources.push(entity.toJSON());
          break;
        case 'Model':
          project.privateModels.push(entity.toJSON());
          break;
        case 'PrivateEndpoint':
          project.privateEndpoints.push(entity.toJSON());
          break;
        case 'Gateway':
          project.gateways.push(entity.toJSON());
          break;
        case 'PublicEndpoint':
          project.publicEndpoints.push(entity.toJSON());
          break;
        case 'API':
          project.apis.push(entity.toJSON());
          break;
        case 'Portal':
          project.portals.push(entity.toJSON());
          break;
      }
    });
  });

  const states = AppState.getData();
  const rev = AppState.getProjectRevision();

  // prepare appState
  if (states['currentlyOpenedPanel']) {
    project.states.push({
      key: 'currentlyOpenedPanel',
      value: states['currentlyOpenedPanel']
    });
  }

  if (states['currentElement']) {
    const {currentElement} = states;

    if (typeof currentElement.toJSON === 'function') {
      project.states.push({
        key: 'currentElement',
        value: {
          ...currentElement.toJSON(),
          type: currentElement.constructor.type
        }
      });
    }
  }

  if (states['currentForecast']) {
    const currentForecast = states['currentForecast'];

    project.states.push({
      key: 'currentForecast',
      value: {
        id: currentForecast['forecast']['id'],
        expanded: currentForecast['expanded'] || false,
        left: currentForecast['forecast']['left'] || 0,
        top: currentForecast['forecast']['top'] || 0,
        selectedDate: currentForecast['selectedDate']
      }
    });
  }

  let projSave = new ProjectService(
      config.projectApiUrl, config.workspaceApiUrl, user.id_token)
    .save(user.profile.sub, config.envId, project, rev)
    .then(res => {
      let newRev = res.response.headers['etag'];
      setProjectRevision(newRev);
    })
    .catch(err => {
      if (err.statusCode === 401) {
        loginManager.refreshLogin();
      }
      throw err;
    })

  saveableServices.push(projSave);

  // save api forecasts
  if (LunchBadgerOptimize) {
    const forecasts = LunchBadgerOptimize.stores.Forecast.getData();
    const forecastService = new LunchBadgerOptimize.services.ForecastService(
      config.forecastApiUrl);

    forecasts.forEach((forecast) => {
      saveableServices.push(forecastService.save(forecast.id, forecast.toJSON()));
    });
  }

  return Promise.all(saveableServices);
}
