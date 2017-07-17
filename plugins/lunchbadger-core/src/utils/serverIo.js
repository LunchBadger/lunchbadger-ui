/*eslint no-console:0 */
import AppState from '../stores/AppState';
import ConnectionStore from '../stores/Connection';
import {waitForStores} from '../utils/waitForStores';
import clearData from '../actions/Stores/clearData';
import {initialize} from '../reduxActions';

const EMPTY_PROJECT = {
  connections: [],
  states: [],
  microservices: [],
  privateEndpoints: [],
  gateways: [],
  publicEndpoints: [],
  apis: [],
  portals: []
};

export function loadFromServer(config, loginManager, projectService) {
  console.info('Pre-fetching projects data...', config);

  const user = loginManager.user;
  const projectData = projectService
    .get(user.profile.sub, config.envId)
    .catch(err => {
      switch (err.statusCode) {
        case 401:
          loginManager.refreshLogin();
          throw err;
        default:
          throw err;
      }
    });

  let storesList = [];

  if (typeof LunchBadgerManage !== 'undefined') {
    storesList.push(
      LunchBadgerManage.stores.Private,
      LunchBadgerManage.stores.Gateway,
      LunchBadgerManage.stores.Public
    );
  }

  if (typeof LunchBadgerCompose !== 'undefined') {
    storesList.push(
      LunchBadgerCompose.stores.Backend
    );
  }

  return projectData.then(res => {
    const project = res[0].body || EMPTY_PROJECT;
    const models = res[1].body;
    const dataSources = res[2].body;
    const modelConfigs = res[3].body;

    const revisions = {
      models: res[1].response.headers.etag,
      dataSources: res[2].response.headers.etag,
      modelConfigs: res[3].response.headers.etag,
    };

    let result = waitForStores(storesList).then(() => {
      // attach connections ;-)
      let getId = (store, name) => {
        return (store.findEntityByFilter({name: name}) || {}).id;
      };

      for (let config of modelConfigs) {
        if (config.dataSource) {
          project.connections.push({
            fromId: getId(LunchBadgerCompose.stores.Backend, config.dataSource),
            toId: getId(LunchBadgerManage.stores.Private, config.name)
          });
        }
      }

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
      LunchBadgerCore.dispatchRedux(initialize(project.states, revisions));
      setTimeout(() => {
        LunchBadgerCore.actions.Stores.AppState.initialize(project.states);
      });
    });

    // at first set amount of init calls required to setup project
    setupInitCalls();

    // then initialize stores
    initializeStores({project, models, dataSources});

    return result;
  });
}

function setupInitCalls() {
  if (typeof LunchBadgerCompose !== 'undefined') {
    LunchBadgerManage.stores.Private.initCalls++;
  }

  if (typeof LunchBadgerMonetize !== 'undefined') {
    LunchBadgerManage.stores.Public.initCalls++;
  }
}

function initializeStores({project, models, dataSources}) {
  if (typeof LunchBadgerManage !== 'undefined') {
    LunchBadgerManage.actions.Stores.Public.initialize(project);
    LunchBadgerManage.actions.Stores.Private.initialize(project);
    LunchBadgerManage.actions.Stores.Gateway.initialize(project);
  }

  if (typeof LunchBadgerCompose !== 'undefined') {
    LunchBadgerCompose.actions.Stores.Private.initialize(models, project);
    LunchBadgerCompose.actions.Stores.Backend.initialize(dataSources);
  }

  if (typeof LunchBadgerMonetize !== 'undefined') {
    LunchBadgerMonetize.actions.Stores.Public.initialize(project);
  }
}

export function saveToServer(config, loginManager, projectService, coreStates) {
  let storesList = [
    ConnectionStore
  ];

  const saveableServices = [];

  const project = {
    name: 'main',
    connections: [],
    states: []
  };

  if (typeof LunchBadgerManage !== 'undefined') {
    storesList.push(
      LunchBadgerManage.stores.Private,
      LunchBadgerManage.stores.Gateway,
      LunchBadgerManage.stores.Public
    );

    project.microServices = [];
    project.privateEndpoints = [];
    project.gateways = [];
    project.publicEndpoints = [];
  }

  if (typeof LunchBadgerMonetize !== 'undefined') {
    project.apis = [];
    project.portals = [];
  }

  storesList.forEach((store) => {
    const entities = store.getData();

    entities.forEach((entity) => {
      switch (entity.constructor.type) {
        case 'Connection':
          if (!(entity.fromId.startsWith('<datasource>') &&
                entity.toId.startsWith('<model>'))) {
            project.connections.push(entity.toJSON());
          }
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
        case 'Microservice':
          project.microServices.push(entity.toJSON());
          break;
      }
    });
  });

  const states = {...AppState.getData(), ...coreStates};

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

  let projSave = projectService
    .save(loginManager.user.profile.sub, config.envId, project)
    .catch(err => {
      if (err.statusCode === 401) {
        loginManager.refreshLogin();
      }
      throw err;
    })

  saveableServices.push(projSave);

  // save api forecasts
  if (typeof LunchBadgerOptimize !== 'undefined') {
    const forecasts = LunchBadgerOptimize.stores.Forecast.getData();
    const forecastService = new LunchBadgerOptimize.services.ForecastService(
      config.forecastApiUrl, loginManager.user.id_token);

    forecasts.forEach((forecast) => {
      saveableServices.push(forecastService.save(forecast.toJSON()));
    });
  }

  return Promise.all(saveableServices);
}

export function clearServer(config, loginManager, projectService) {
  let user = loginManager.user;

  let promise = projectService.clearProject(user.profile.sub, config.envId)
    .catch(err => {
      if (err.statusCode === 401) {
        loginManager.refreshLogin();
      }
      throw err;
    });

  clearData();
  return promise;
}
