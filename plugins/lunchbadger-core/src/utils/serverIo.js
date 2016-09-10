/*eslint no-console:0 */
import {notify} from 'react-notify-toast';

import AppState from '../stores/AppState';
import Connection from '../stores/Connection';
import ProjectService from '../services/ProjectService';
import setProjectRevision from '../actions/Stores/AppState/setProjectRevision';
import {waitForStores} from '../utils/waitForStores';

export function loadFromServer(config, user) {
  console.info('Pre-fetching projects data...', config);

  const projectService = new ProjectService(config.projectApiUrl, user.id_token);
  const projectData = projectService.get(config.producerId, config.envId);

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

  projectData.then((res) => {
    const data = res.body;
    const rev = res.response.headers['etag'];

    setProjectRevision(rev);

    waitForStores(storesList, () => {
      // attach connections ;-)
      data.connections.forEach((connection) => {
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
        LunchBadgerCore.actions.Stores.AppState.initialize(data.states);
      });

      notify.show('All data has been synced with API', 'success');
    });

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
  }).catch((err) => {
    console.error(err);
    notify.show('Failed to sync data with API, working offline! Try to refresh page...', 'error');
  });

}

export function saveToServer(config) {
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

  let projSave = new ProjectService(config.projectApiUrl)
    .save(config.producerId, config.envId, project, rev)
    .then(res => {
      let newRev = res.response.headers['etag'];
      setProjectRevision(newRev);
    });

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

  Promise.all(saveableServices).then(() => {
    notify.show('All data has been synced with API', 'success');
  }).catch((err) => {
    console.error(err);
    notify.show('Cannot save data to local API', 'error');
  });
}
